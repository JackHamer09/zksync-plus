import { $fetch } from "ohmyfetch";

import type { ApiTransaction } from "@/store/zksync/era/transactionsHistory";
import type { Token } from "@/types";
import type { Ref } from "vue";

import { mapApiTransaction } from "@/utils/zksync/era/mappers";

export default (
  getTokens: () => Promise<Token[] | undefined>,
  blockExplorerApi: Ref<string>,
  userAddress: Ref<string>
) => {
  let currentTransactionHash = <string | undefined>undefined;

  const {
    result: transaction,
    inProgress: transactionRequestInProgress,
    error: transactionRequestError,
    execute: requestTransaction,
  } = usePromise(
    async () => {
      if (!currentTransactionHash) throw new Error("Transaction hash is not available");

      const tokens = await getTokens();
      if (!tokens) throw new Error("Tokens are not available");

      const response: ApiTransaction = await $fetch(`${blockExplorerApi.value}/transaction/${currentTransactionHash}`);

      return mapApiTransaction(response, tokens, userAddress.value);
    },
    { cache: false }
  );

  return {
    transaction,
    transactionRequestInProgress,
    transactionRequestError,
    requestTransaction: async (transactionHash: string) => {
      currentTransactionHash = transactionHash;
      await requestTransaction();
    },
  };
};
