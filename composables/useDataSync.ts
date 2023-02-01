import { ref } from "vue";

import { $fetch } from "ohmyfetch";

import useOrders from "@/composables/useOrders";

import { db } from "@/db";

export type Address = string;
export type InputType = "string" | "address" | "bool" | "bytes" | "bytes32" | "uint256" | "uint8";

export type TransactionData = {
  calldata: string;
  contractAddress: Address;
  value: string;
  sighash: string;
  method?: {
    name: string;
    inputs: {
      name: string;
      type: InputType;
      value: string;
      encodedValue: string;
    }[];
  };
};

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

export type TransactionStatus = "pending" | "included" | "verified" | "failed";

export type Transaction = {
  blockHash: string;
  blockNumber: number;
  data: TransactionData;
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
  logs: [];
  transactionHash: string;
  balanceChanges: [];
  transfers: TokenTransfer[];
  erc20Transfers?: TokenTransfer[];
  transfer?: TokenTransfer;
};

export type TransactionSearchParams = {
  direction: "older" | "newer";
  blockNumber?: number;
  fromBlockNumber?: number;
  fromTxIndex?: number;
  accountAddress?: string;
  contractAddress?: string;
  limit?: number;
  offset?: number;
};

const BUIDL_BUXX_TOKEN_ADDRESS = "0xfc5b07a5dd1b80cf271d35642f75cc0500ff1e2c";

export default () => {
  const pending = ref(false);
  const failed = ref(false);
  const { orders, getOrders } = useOrders();

  const getCollection = async (address: string) => {
    pending.value = true;
    failed.value = false;
    try {
      const response = await $fetch(
        `https://z2-dev-api-explorer.zksync.dev/transactions?${new URLSearchParams({
          limit: "1",
          direction: "older",
          accountAddress: address,
        })}`
      );
      for (let offset = 0; offset < response.total; offset += 100) {
        const items = await $fetch(
          `https://z2-dev-api-explorer.zksync.dev/transactions?${new URLSearchParams({
            limit: "100",
            direction: "older",
            fromBlockNumber: response.list[0].blockNumber.toString(),
            fromTxIndex: (response.list[0].indexInBlock! + 1).toString(),
            offset: offset.toString(),
            accountAddress: address,
          })}`
        );
        addToDB(items.list);
      }
    } catch (error: unknown) {
      failed.value = true;
    } finally {
      pending.value = false;
    }
  };

  const getUpdatedCollection = async (address: string) => {
    try {
      const response = await $fetch(
        `https://z2-dev-api-explorer.zksync.dev/transactions?${new URLSearchParams({
          limit: "1",
          direction: "older",
          accountAddress: address,
        })}`
      );
      await getOrders();
      if (response.total > orders.value.length) {
        pending.value = true;
        failed.value = false;
        for (let offset = 0; offset < response.total - orders.value.length; offset += 20) {
          const items = await $fetch(
            `https://z2-dev-api-explorer.zksync.dev/transactions?${new URLSearchParams({
              limit: "20",
              direction: "older",
              fromBlockNumber: response.list[0].blockNumber.toString(),
              fromTxIndex: (response.list[0].indexInBlock! + 1).toString(),
              offset: offset.toString(),
              accountAddress: address,
            })}`
          );
          addToDB(items.list.filter((item) => new Date(item.receivedAt).getTime() > orders.value[0].receivedAt));
        }
      }
    } catch (error: unknown) {
      failed.value = true;
    } finally {
      pending.value = false;
    }
  };

  const addToDB = (transactions: Transaction[]) => {
    const filterCollection = transactions
      .filter((item) => item.erc20Transfers![1]?.tokenInfo.address === BUIDL_BUXX_TOKEN_ADDRESS)
      .map((item) => {
        return {
          transactionHash: item.transactionHash,
          orderId: item.transactionHash.slice(-5),
          receivedAt: new Date(item.receivedAt).getTime(),
          amount: item.erc20Transfers![1]?.amount,
          from: item.erc20Transfers![1]?.from,
        };
      });
    db.transactions.bulkAdd(filterCollection);
  };

  return {
    pending,
    failed,
    getCollection,
    getUpdatedCollection,
  };
};
