import { computed } from "vue";

import type { TokenAmount } from "@/types";
import type { Ref } from "vue";

export const groupBalancesByAmount = (balances: Ref<TokenAmount[]>) =>
  computed(() => {
    const groups: Record<string, { title: string | null; balances: TokenAmount[] }> = {
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

export const groupTransactionsByDate = <T>(transactions: Ref<T[]>, getDate: (transaction: T) => Date) =>
  computed(() => {
    const groups: Record<string, { title: string | null; transactions: T[] }> = {};
    for (const transaction of transactions.value) {
      const date = getDate(transaction);
      const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      if (!groups[dateKey]) {
        groups[dateKey] = {
          title: date.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" }),
          transactions: [],
        };
      }
      groups[dateKey].transactions.push(transaction);
    }
    return groups;
  });
