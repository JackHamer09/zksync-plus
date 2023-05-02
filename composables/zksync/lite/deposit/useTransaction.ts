import type { ConfirmationModalTransaction } from "@/components/transaction/zksync/lite/deposit/ConfirmTransactionModal.vue";
import type { BigNumberish } from "ethers";
import type { Wallet } from "zksync";

import { formatError } from "@/utils/formatters";

export default (getWalletInstance: () => Promise<Wallet | undefined>) => {
  const status = ref<"not-started" | "processing" | "waiting-for-signature" | "done">("not-started");
  const error = ref<Error | undefined>();
  const ethTransactionHash = ref<string | undefined>();

  const commitTransaction = async (
    transaction: ConfirmationModalTransaction,
    fee: { gasLimit: BigNumberish; gasPrice: BigNumberish }
  ) => {
    try {
      error.value = undefined;

      status.value = "processing";
      const wallet = await getWalletInstance();
      if (!wallet) throw new Error("Wallet is not available");

      status.value = "waiting-for-signature";
      const depositResponse = await wallet.depositToSyncFromEthereum({
        depositTo: transaction.to,
        token: transaction.token.symbol,
        amount: transaction.amount,
        ethTxOptions: {
          gasLimit: fee.gasLimit,
          gasPrice: fee.gasPrice,
        },
      });

      ethTransactionHash.value = depositResponse.ethTx.hash;
      status.value = "done";
      return depositResponse;
    } catch (err) {
      error.value = formatError(err as Error);
      status.value = "not-started";
    }
  };

  return {
    status,
    error,
    ethTransactionHash,
    commitTransaction,
  };
};
