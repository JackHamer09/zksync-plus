import { submitSignedTransactionsBatch } from "zksync";

import type { BigNumberish } from "ethers";
import type { Wallet } from "zksync";
import type { BatchBuilder } from "zksync/build/batch-builder";
import type { ChangePubKey, IncomingTxFeeType } from "zksync/build/types";

import { formatError } from "@/utils/formatters";
import { isTransactionFeePayedSeparately } from "@/utils/zksync/lite/helpers";

type TransactionParams = {
  type: IncomingTxFeeType;
  to: string;
  symbol: string;
  amount: BigNumberish;
};

export default (getWalletInstance: () => Promise<Wallet | undefined>) => {
  const status = ref<"not-started" | "processing" | "waiting-for-signature" | "sending" | "done">("not-started");
  const error = ref<Error | undefined>();
  const transactionHashes = ref<string[]>([]);

  const commitTransaction = async (
    transactions: TransactionParams[],
    feeSymbol: string,
    totalFee: BigNumberish,
    accountActivationTransaction?: ChangePubKey
  ) => {
    try {
      error.value = undefined;

      status.value = "processing";
      const wallet = await getWalletInstance();
      if (!wallet) throw new Error("Wallet is not available");

      const nonce = await wallet.getNonce("committed");
      const batchBuilder = wallet.batchBuilder(nonce);

      if (accountActivationTransaction) {
        batchBuilder.addChangePubKey({
          tx: accountActivationTransaction,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          alreadySigned: true,
        });
      }

      const feePaidSeparately = isTransactionFeePayedSeparately(transactions, feeSymbol);
      for (const transaction of transactions) {
        if (transaction.type === "Transfer") {
          addTransferToBatch(batchBuilder, transaction, feePaidSeparately ? 0 : totalFee);
        } else if (transaction.type === "Withdraw") {
          addWithdrawToBatch(batchBuilder, transaction, feePaidSeparately ? 0 : totalFee);
        }
      }
      if (feePaidSeparately) {
        addTransferToBatch(
          batchBuilder,
          { type: "Transfer", to: wallet.address(), amount: "0", symbol: feeSymbol },
          totalFee
        );
      }

      status.value = "waiting-for-signature";
      const batchTransactionData = await batchBuilder.build();

      status.value = "sending";
      const submittedTransactions = await submitSignedTransactionsBatch(
        wallet.provider,
        batchTransactionData.txs,
        batchTransactionData.signature ? [batchTransactionData.signature] : undefined
      );
      transactionHashes.value = submittedTransactions.map((tx) => tx.txHash);
      status.value = "done";
      return submittedTransactions;
    } catch (err) {
      error.value = formatError(err as Error);
      status.value = "not-started";
    }
  };

  return {
    status,
    error,
    transactionHashes,
    commitTransaction,
  };
};

function addTransferToBatch(batchBuilder: BatchBuilder, transaction: TransactionParams, fee: BigNumberish) {
  const { to, amount, symbol } = transaction;
  batchBuilder.addTransfer({ to, amount, token: symbol, fee });
}

function addWithdrawToBatch(batchBuilder: BatchBuilder, transaction: TransactionParams, fee: BigNumberish) {
  const { to, amount, symbol } = transaction;
  batchBuilder.addWithdraw({ ethAddress: to, amount, token: symbol, fee });
}
