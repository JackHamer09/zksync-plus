import { defineStore, storeToRefs } from "pinia";

import useObservable from "@/composables/useObservable";

import type { ZkSyncLiteTransaction } from "@/utils/zksync/lite/mappers";
import type { PaginationQuery } from "zksync/build/types";

import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";
import { mapApiTransaction } from "@/utils/zksync/lite/mappers";

export const useLiteTransactionsHistoryStore = defineStore("liteTransactionsHistory", () => {
  const liteProviderStore = useLiteProviderStore();
  const liteTokensStore = useLiteTokensStore();
  const { tokens } = storeToRefs(liteTokensStore);
  const { account } = storeToRefs(useOnboardStore());

  const transactionsRequest = async (pagination: PaginationQuery<string>): Promise<ZkSyncLiteTransaction[]> => {
    const provider = await liteProviderStore.requestProvider();
    if (!provider) {
      throw new Error("Provider is not available");
    }

    if (!(await liteTokensStore.requestTokens())) {
      throw new Error("Tokens are not available");
    }

    if (!account.value.address) {
      throw new Error("Wallet address is not available");
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
      const currentTransactionHashes = new Set(transactions.value.map((transaction) => transaction.txHash));
      const txs = await transactionsRequest({
        from: transactions.value.length ? transactions.value[0].txHash : "latest",
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
      const txs = await transactionsRequest({
        from: transactions.value.length ? transactions.value[transactions.value.length - 1].txHash : "latest",
        limit: 50,
        direction: "older",
      });
      transactions.value.push(...txs);
      if (txs.length < 50) {
        canLoadMore.value = false;
      }
      getTransactionTokenPrices(txs);
    },
    { cache: false }
  );

  const { subscribe: subscribeOnAccountChange, notify: notifyOnAccountChange } = useObservable();
  subscribeOnAccountChange(() => {
    transactions.value = [];
    resetRecentTransactionsRequest();
    resetPreviousTransactionsRequest();
  });
  watch(
    () => account.value.address,
    () => {
      notifyOnAccountChange();
    }
  );

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

    subscribeOnAccountChange,
  };
});
