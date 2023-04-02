import { ref } from "vue";

import { closestPackableTransactionFee } from "zksync";

import type { BigNumber, BigNumberish } from "ethers";
import type { RestProvider } from "zksync";
import type { IncomingTxFeeType } from "zksync/build/types";

type FeeEstimationParams = {
  type: IncomingTxFeeType;
  to: string;
  symbol: string;
};

export default (requestProvider: () => Promise<RestProvider | undefined>) => {
  const result = ref<BigNumberish | undefined>();
  const inProgress = ref(false);
  const error = ref<Error | undefined>();

  const estimateFee = async (params: FeeEstimationParams[], from: string, feeSymbol: string) => {
    try {
      inProgress.value = true;
      result.value = undefined;

      const provider = await requestProvider();
      if (!provider) throw new Error("Provider is not available");
      let fee: BigNumber | undefined = undefined;
      if (params.length === 1 && params[0].symbol === feeSymbol) {
        const { type, to, symbol } = params[0];
        fee = (await provider.getTransactionFee(type, to, symbol)).totalFee;
      } else {
        fee = await provider.getTransactionsBatchFee(
          [...params.map((e) => e.type), "Transfer"],
          [...params.map((e) => e.to), from],
          feeSymbol
        );
      }
      result.value = fee ? closestPackableTransactionFee(fee).toString() : undefined;
    } catch (err) {
      error.value = err as Error;
    } finally {
      inProgress.value = false;
    }
  };

  return {
    result,
    inProgress,
    error,
    estimateFee,
  };
};
