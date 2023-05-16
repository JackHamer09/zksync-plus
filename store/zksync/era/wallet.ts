import { watch } from "vue";

import { fetchSigner } from "@wagmi/core";
import { BigNumber } from "ethers";
import { defineStore, storeToRefs } from "pinia";
import { Web3Provider } from "zksync-web3";

import type { TokenAmount } from "@/types";
import type { BigNumberish } from "ethers";

import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTokensStore } from "@/store/zksync/era/tokens";

export const useEraWalletStore = defineStore("eraWallet", () => {
  const onboardStore = useOnboardStore();
  const eraProviderStore = useEraProviderStore();
  const eraTokensStore = useEraTokensStore();
  const { tokens } = storeToRefs(eraTokensStore);
  const { account, network } = storeToRefs(onboardStore);
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  const { execute: getSigner, reset: resetSigner } = usePromise(async () => {
    const walletNetworkId = network.value.chain?.id;
    if (walletNetworkId !== selectedEthereumNetwork.value.id) {
      throw new Error(
        `Incorrect wallet network selected: #${walletNetworkId} (expected: ${selectedEthereumNetwork.value.name} #${selectedEthereumNetwork.value.id})`
      );
    }

    const signer = await fetchSigner();
    if (!signer) throw new Error("Signer is not available");

    // TODO: Figure out a better way to create an Era signer
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const web3Provider = new Web3Provider(signer.provider.provider);
    const eraL2Signer = web3Provider.getSigner();
    return eraL2Signer;
  });

  const {
    result: balanceRaw,
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise<{ [tokenAddress: string]: BigNumberish }>(
    async () => {
      await eraTokensStore.requestTokens();
      if (!tokens.value) throw new Error("Tokens are not available");

      if (!account.value.address) throw new Error("Account is not available");

      const provider = eraProviderStore.requestProvider();
      const balances = await Promise.all(
        Object.entries(tokens.value).map(async ([, token]) => {
          return {
            address: token.address,
            amount: (await provider.getBalance(onboardStore.account.address!, undefined, token.address)).toString(),
          };
        })
      );

      console.log(123);

      return balances.reduce((accumulator: { [tokenAddress: string]: BigNumberish }, { address, amount }) => {
        accumulator[address] = amount;
        return accumulator;
      }, {});
    },
    { cache: 30000 }
  );
  watch(
    balanceRaw,
    (balances) => {
      Object.entries(balances ?? {}).map(([tokenAddress, amount]) => {
        if (BigNumber.from(amount).isZero()) return;
        eraTokensStore.requestTokenPrice(tokenAddress);
      });
    },
    { immediate: true }
  );

  const balance = computed<TokenAmount[]>(() => {
    return Object.entries(tokens.value ?? {}).map(([, token]) => {
      const amount = balanceRaw.value?.[token.address] ?? "0";
      return { ...token, amount };
    });
  });
  const allBalancePricesLoaded = computed(() => !balance.value.some((e) => e.price === "loading"));

  onboardStore.subscribeOnAccountChange(() => {
    resetSigner();
    resetBalance();
  });

  return {
    getSigner,

    balance,
    balanceInProgress: computed(() => balanceInProgress.value),
    balanceError: computed(() => balanceError.value),
    allBalancePricesLoaded,
    requestBalance,
  };
});
