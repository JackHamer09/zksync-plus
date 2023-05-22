import { $fetch } from "ohmyfetch";
import { defineStore, storeToRefs } from "pinia";

import type { EraTransaction } from "@/utils/zksync/era/mappers";

import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTokensStore } from "@/store/zksync/era/tokens";
import { mapApiTransaction } from "@/utils/zksync/era/mappers";

type TransactionStatus = "pending" | "included" | "verified" | "failed";
export type TokenTransfer = {
  amount: string;
  from: string;
  to: string;
  type: "fee" | "transfer" | "withdrawal" | "deposit";
  tokenInfo: {
    address: string;
    decimals: number;
    l1Address: string;
    l2Address: string;
    name: string;
    symbol: string;
    usdPrice: string | null | "unknown";
  };
};
export type ApiTransaction = {
  blockHash: string;
  blockNumber: number;
  ethCommitTxHash: string | null;
  ethExecuteTxHash: string | null;
  ethProveTxHash: string | null;
  fee: string;
  indexInBlock?: number;
  initiatorAddress: string;
  isL1Originated: boolean;
  nonce: null | number;
  receivedAt: string;
  status: TransactionStatus;
  transactionHash: string;
  balanceChanges: TokenTransfer[];
  erc20Transfers?: TokenTransfer[];
  transfer?: TokenTransfer;
  l1BatchNumber?: number;
};
type TransactionSearchParams = {
  direction: "older" | "newer";
  blockNumber?: number;
  l1BatchNumber?: number;
  fromBlockNumber?: number;
  fromTxIndex?: number;
  accountAddress?: string;
  contractAddress?: string;
  limit: number;
  offset?: number;
};

const TRANSACTIONS_FETCH_LIMIT = 25;

export const useEraTransactionsHistoryStore = defineStore("eraTransactionsHistory", () => {
  const onboardStore = useOnboardStore();
  const eraTokensStore = useEraTokensStore();
  const { eraNetwork } = storeToRefs(useEraProviderStore());
  const { tokens } = storeToRefs(eraTokensStore);
  const { account } = storeToRefs(onboardStore);

  const transactionsRequest = async (requestParams: TransactionSearchParams): Promise<EraTransaction[]> => {
    if (!(await eraTokensStore.requestTokens())) {
      throw new Error("Tokens are not available");
    }

    const address = account.value.address;
    if (!address) {
      throw new Error("Account is not available");
    }

    const params: Record<string, string> = Object.fromEntries(
      Object.entries(requestParams)
        .filter(([, value]) => !!value)
        .map(([key, value]) => [key, value.toString()])
    );

    const response: { list: ApiTransaction[]; total: number } = await $fetch(
      `${eraNetwork.value.blockExplorerApi}/transactions?${new URLSearchParams({
        ...params,
        accountAddress: address,
      })}`
    );

    const allTokens = tokens.value ? Object.values(tokens.value) : [];
    return response.list.map((transaction) => mapApiTransaction(transaction, allTokens, address));
  };

  const transactions = ref<EraTransaction[]>([]);
  const canLoadMore = ref(false);

  const getTransactionTokenPrices = (transactions: EraTransaction[]) => {
    transactions.forEach((transaction) => {
      if (transaction.token) {
        eraTokensStore.requestTokenPrice(transaction.token.address);
      }
      if (transaction.feeToken) {
        eraTokensStore.requestTokenPrice(transaction.feeToken.address);
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
        fromBlockNumber: mostRecentTransactionInTheList ? mostRecentTransactionInTheList.blockNumber : undefined,
        limit: TRANSACTIONS_FETCH_LIMIT,
        direction: transactions.value.length ? "newer" : "older",
      });
      if (!transactions.value.length) {
        if (txs.length === TRANSACTIONS_FETCH_LIMIT) {
          canLoadMore.value = true;
        } else {
          canLoadMore.value = false;
        }
      }
      const currentTransactionHashes = new Set(transactions.value.map((transaction) => transaction.transactionHash));
      transactions.value.unshift(...txs.filter((tx) => !currentTransactionHashes.has(tx.transactionHash)));
      getTransactionTokenPrices(txs);
      if (txs.length < TRANSACTIONS_FETCH_LIMIT) {
        canLoadMore.value = false;
      }
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
        fromBlockNumber: oldestTransactionInTheList.blockNumber,
        limit: TRANSACTIONS_FETCH_LIMIT,
        direction: "older",
      });
      const currentTransactionHashes = new Set(transactions.value.map((transaction) => transaction.transactionHash));
      transactions.value.push(...txs.filter((tx) => !currentTransactionHashes.has(tx.transactionHash)));
      getTransactionTokenPrices(txs);
      if (txs.length < TRANSACTIONS_FETCH_LIMIT) {
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
    transactions: computed<EraTransaction[]>(() =>
      transactions.value.map((transaction) => ({
        ...transaction,
        token: transaction.token ? tokens.value?.[transaction.token.address] ?? transaction.token : undefined,
        feeToken: transaction.feeToken
          ? tokens.value?.[transaction.feeToken.address] ?? transaction.feeToken
          : undefined,
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
