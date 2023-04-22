import { computed } from "vue";

import type { Balance } from "@/store/zksync/lite/wallet";
import type { ZkSyncLiteTransaction } from "@/utils/zksync/lite/mappers";
import type { Ref } from "vue";

export const groupBalancesByAmount = (balances: Ref<Balance[]>) =>
  computed(() => {
    const groups: Record<string, { title: string | null; balances: Balance[] }> = {
      default: {
        title: null,
        balances: [],
      },
      small: {
        title: "Small balances",
        balances: [],
      },
      zero: {
        title: "Zero balances",
        balances: [],
      },
    };
    for (const balanceItem of balances.value) {
      const decimalBalance =
        typeof balanceItem.price === "number"
          ? removeSmallAmount(balanceItem.amount, balanceItem.decimals, balanceItem.price)
          : parseTokenAmount(balanceItem.amount, balanceItem.decimals);
      if (!isOnlyZeroes(decimalBalance)) {
        groups.default.balances.push(balanceItem);
      } else if (decimalBalance === "0") {
        groups.zero.balances.push(balanceItem);
      } else {
        groups.small.balances.push(balanceItem);
      }
    }
    return [groups.default, groups.small, groups.zero].filter((group) => group.balances.length);
  });

export const groupTransactionsByDate = (transactions: Ref<ZkSyncLiteTransaction[]>) =>
  computed(() => {
    const groups: Record<string, { title: string | null; transactions: ZkSyncLiteTransaction[] }> = {};
    for (const transaction of transactions.value) {
      const date = new Date(transaction.createdAt!);
      const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      if (!groups[dateKey]) {
        groups[dateKey] = {
          title: date.toLocaleDateString(),
          transactions: [],
        };
      }
      groups[dateKey].transactions.push(transaction);
    }
    return groups;
  });
