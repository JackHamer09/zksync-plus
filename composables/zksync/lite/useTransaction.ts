import { submitSignedTransactionsBatch } from "zksync";

import type { BigNumberish } from "ethers";
import type { Wallet } from "zksync";
import type { BatchBuilder } from "zksync/build/batch-builder";
import type { ChangePubKey, IncomingTxFeeType } from "zksync/build/types";

import { isTransactionFeePayedSeparately } from "@/utils/zksync/lite";

export type TransactionParams = {
  type: IncomingTxFeeType;
  to: string;
  symbol: string;
  amount: BigNumberish;
};

export default (getWalletInstance: () => Promise<Wallet | undefined>) => {
  const commitTransaction = async (
    transactions: TransactionParams[],
    feeSymbol: string,
    totalFee: BigNumberish,
    cpkTx?: ChangePubKey
  ) => {
    const wallet = await getWalletInstance();
    if (!wallet) throw new Error("Wallet is not available");

    const nonce = await wallet.getNonce("committed");
    const batchBuilder = wallet.batchBuilder(nonce);

    if (cpkTx) {
      batchBuilder.addChangePubKey({
        tx: cpkTx,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        alreadySigned: true,
      });
    }

    const feePaidSeparately = isTransactionFeePayedSeparately(transactions, feeSymbol);
    for (const transaction of transactions) {
      if (transaction.type === "Transfer") {
        addTransferToBatch(batchBuilder, transaction, feePaidSeparately ? 0 : totalFee);
      }
    }
    if (feePaidSeparately) {
      addTransferToBatch(
        batchBuilder,
        { type: "Transfer", to: wallet.address(), amount: "0", symbol: feeSymbol },
        totalFee
      );
    }

    const batchTransactionData = await batchBuilder.build();
    const submittedTransactions = await submitSignedTransactionsBatch(
      wallet.provider,
      batchTransactionData.txs,
      batchTransactionData.signature ? [batchTransactionData.signature] : undefined
    );
    return submittedTransactions;
  };

  return {
    commitTransaction,
  };
};

function addTransferToBatch(batchBuilder: BatchBuilder, transaction: TransactionParams, fee: BigNumberish) {
  const { to, amount, symbol } = transaction;
  batchBuilder.addTransfer({ to, amount, token: symbol, fee });
}
