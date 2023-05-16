import type { ZkSyncLiteToken } from "@/types";
import type { RestProvider } from "zksync";

import { mapApiTransaction } from "@/utils/zksync/lite/mappers";

export default (
  getProvider: () => Promise<RestProvider | undefined>,
  getTokens: () => Promise<ZkSyncLiteToken[] | undefined>
) => {
  let currentTransactionHashes = <string[]>[];

  const {
    result: transactions,
    inProgress: transactionsRequestInProgress,
    error: transactionsRequestError,
    execute: requestTransactions,
  } = usePromise(
    async () => {
      const provider = await getProvider();
      if (!provider) {
        throw new Error("Provider is not available");
      }

      const tokens = await getTokens();
      if (!tokens) {
        throw new Error("Tokens are not available");
      }

      return (
        await Promise.all(currentTransactionHashes.map((transactionHash) => provider.txDataDetailed(transactionHash)))
      )
        .filter((transaction) => transaction.result?.tx)
        .map((transaction) => mapApiTransaction(transaction.result!.tx, tokens));
    },
    { cache: false }
  );

  return {
    transactions,
    transactionsRequestInProgress,
    transactionsRequestError,
    requestTransactions: (transactionHashes: string[]) => {
      currentTransactionHashes = transactionHashes;
      requestTransactions();
    },
  };
};
