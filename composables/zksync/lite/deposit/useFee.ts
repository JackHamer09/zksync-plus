import { BigNumber } from "ethers";
import {
  ERC20_DEPOSIT_GAS_LIMIT,
  ERC20_RECOMMENDED_DEPOSIT_GAS_LIMIT,
  ETH_RECOMMENDED_DEPOSIT_GAS_LIMIT,
} from "zksync/build/utils";

import type { Token, TokenAmount } from "@/types";
import type { Provider } from "@wagmi/core";
import type { BigNumberish } from "ethers";
import type { Ref } from "vue";
import type { Wallet } from "zksync";
import type { IncomingTxFeeType } from "zksync/build/types";

import { calculateFee } from "@/utils/helpers";

export type FeeEstimationParams = {
  type: IncomingTxFeeType;
  to: string;
  symbol: string;
};

export default (
  getProvider: () => Provider,
  getWalletInstance: () => Promise<Wallet | undefined>,
  tokens: Ref<{ [tokenSymbol: string]: Token } | undefined>,
  balances: Ref<TokenAmount[]>
) => {
  const params = {
    from: undefined as string | undefined,
    tokenAddress: undefined as string | undefined,
  };

  const gasLimit = ref<BigNumberish | undefined>();
  const gasPrice = ref<BigNumberish | undefined>();

  const totalFee = computed(() => {
    if (!gasLimit.value || !gasPrice.value) return undefined;
    return calculateFee(gasLimit.value, gasPrice.value).toString();
  });

  const feeToken = computed(() => {
    return tokens.value?.["ETH"];
  });
  const enoughBalanceToCoverFee = computed(() => {
    if (!feeToken.value || inProgress.value) {
      return true;
    }
    const feeTokenBalance = balances.value.find((e) => e.address === feeToken.value!.address);
    if (!feeTokenBalance) return true;
    if (totalFee.value && BigNumber.from(totalFee.value).gt(feeTokenBalance.amount)) {
      return false;
    }
    return true;
  });

  const getEthTransactionFee = async () => {
    return BigNumber.from(ETH_RECOMMENDED_DEPOSIT_GAS_LIMIT);
  };
  const getERC20TransactionFee = async (gasPrice: BigNumberish) => {
    const provider = getProvider();
    const wallet = await getWalletInstance();
    if (!wallet) throw new Error("Wallet is not available");

    const nonce = wallet.getNonce();
    const mainZkSyncContract = wallet.getZkSyncMainContract();
    const gasEstimate = await mainZkSyncContract.estimateGas
      .depositERC20(params.tokenAddress, "1000000000", params.from, {
        nonce,
        gasPrice: gasPrice,
      })
      .then(
        (estimate) => estimate,
        () => BigNumber.from("0")
      );
    const recommendedGasLimit =
      provider.network.chainId === 1 && ERC20_DEPOSIT_GAS_LIMIT[params.tokenAddress!]
        ? BigNumber.from(ERC20_DEPOSIT_GAS_LIMIT[params.tokenAddress!])
        : ERC20_RECOMMENDED_DEPOSIT_GAS_LIMIT;
    const gasLimit = gasEstimate.gte(recommendedGasLimit) ? gasEstimate : recommendedGasLimit;
    return BigNumber.from(gasLimit);
  };
  const estimate = async (from: string, tokenAddress: string) => {
    params.from = from;
    params.tokenAddress = tokenAddress;

    await estimateFee();
  };
  const {
    inProgress,
    error,
    execute: estimateFee,
  } = usePromise(
    async () => {
      const provider = getProvider();
      gasPrice.value = await provider.getGasPrice();

      if (!feeToken.value) throw new Error("Tokens are not available");

      if (params.tokenAddress === feeToken.value?.address) {
        gasLimit.value = (await getEthTransactionFee()).toString();
      } else {
        gasLimit.value = (await getERC20TransactionFee(gasPrice.value)).toString();
      }
    },
    { cache: false }
  );

  return {
    gasLimit,
    gasPrice,
    result: totalFee,
    inProgress,
    error,
    estimateFee: estimate,

    feeToken,
    enoughBalanceToCoverFee,
  };
};
