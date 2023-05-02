import { defineStore, storeToRefs } from "pinia";

import type { ZkSyncLiteTransaction } from "@/utils/zksync/lite/mappers";
import type { PaginationQuery } from "zksync/build/types";

import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";
import { mapApiTransaction } from "@/utils/zksync/lite/mappers";

export const useLiteTransactionsHistoryStore = defineStore("liteTransactionsHistory", () => {
  const onboardStore = useOnboardStore();
  const liteProviderStore = useLiteProviderStore();
  const liteTokensStore = useLiteTokensStore();
  const { tokens } = storeToRefs(liteTokensStore);
  const { account } = storeToRefs(onboardStore);

  const transactionsRequest = async (pagination: PaginationQuery<string>): Promise<ZkSyncLiteTransaction[]> => {
    const provider = await liteProviderStore.requestProvider();
    if (!provider) {
      throw new Error("Provider is not available");
    }

    if (!(await liteTokensStore.requestTokens())) {
      throw new Error("Tokens are not available");
    }

    if (!account.value.address) {
      throw new Error("Account is not available");
    }

    const response = await provider.accountTxsDetailed(account.value.address, pagination);

    if (response.error) {
      throw new Error(response.error.message);
    } else if (!response.result) {
      throw new Error("No result");
    }

    return response.result.list.map((transaction) =>
      mapApiTransaction(transaction, tokens.value ? Object.values(tokens.value) : [])
    );
  };

  const transactions = ref<ZkSyncLiteTransaction[]>([]);
  const canLoadMore = ref(false);

  const getTransactionTokenPrices = (transactions: ZkSyncLiteTransaction[]) => {
    transactions.forEach((transaction) => {
      if (transaction.token?.isNFT === false) {
        liteTokensStore.requestTokenPrice(transaction.token.symbol);
      }
      if (transaction.feeToken) {
        liteTokensStore.requestTokenPrice(transaction.feeToken.symbol);
      }
    });
  };

  const {
    inProgress: recentTransactionsRequestInProgress,
    error: recentTransactionsRequestError,
    execute: requestRecentTransactions,
    reset: resetRecentTransactionsRequest,
    reload: reloadRecentTransactions,
  } = usePromise(
    async () => {
      const mostRecentTransactionInTheList = transactions.value[0];
      const txs = await transactionsRequest({
        from: mostRecentTransactionInTheList
          ? mostRecentTransactionInTheList.ethTxHash ?? mostRecentTransactionInTheList.txHash
          : "latest",
        limit: 25,
        direction: transactions.value.length ? "newer" : "older",
      });
      if (!transactions.value.length) {
        if (txs.length === 25) {
          canLoadMore.value = true;
        } else {
          canLoadMore.value = false;
        }
      }
      const currentTransactionHashes = new Set(transactions.value.map((transaction) => transaction.txHash));
      transactions.value.unshift(...txs.filter((tx) => !currentTransactionHashes.has(tx.txHash)));
      getTransactionTokenPrices(txs);
    },
    { cache: 30000 }
  );

  const {
    inProgress: previousTransactionsRequestInProgress,
    error: previousTransactionsRequestError,
    execute: requestPreviousTransactions,
    reset: resetPreviousTransactionsRequest,
  } = usePromise(
    async () => {
      const oldestTransactionInTheList = transactions.value[transactions.value.length - 1];
      if (!oldestTransactionInTheList) {
        return requestRecentTransactions();
      }
      const txs = await transactionsRequest({
        from: oldestTransactionInTheList.ethTxHash ?? oldestTransactionInTheList.txHash,
        limit: 50,
        direction: "older",
      });
      const currentTransactionHashes = new Set(transactions.value.map((transaction) => transaction.txHash));
      transactions.value.push(...txs.filter((tx) => !currentTransactionHashes.has(tx.txHash)));
      getTransactionTokenPrices(txs);
      if (txs.length < 50) {
        canLoadMore.value = false;
      }
    },
    { cache: false }
  );

  onboardStore.subscribeOnAccountChange(() => {
    transactions.value = [];
    resetRecentTransactionsRequest();
    resetPreviousTransactionsRequest();
  });

  return {
    transactions: computed<ZkSyncLiteTransaction[]>(() =>
      transactions.value.map((transaction) => ({
        ...transaction,
        token:
          transaction.token?.isNFT === false && tokens.value?.[transaction.token.symbol]
            ? { ...tokens.value?.[transaction.token.symbol], isNFT: false }
            : transaction.token,
        feeToken:
          transaction.feeToken && tokens.value?.[transaction.feeToken.symbol]
            ? { ...tokens.value?.[transaction.feeToken.symbol], isNFT: false }
            : transaction.feeToken,
      }))
    ),

    recentTransactionsRequestInProgress,
    recentTransactionsRequestError,
    requestRecentTransactions,
    reloadRecentTransactions,

    canLoadMore,
    previousTransactionsRequestInProgress,
    previousTransactionsRequestError,
    requestPreviousTransactions,
  };
});
