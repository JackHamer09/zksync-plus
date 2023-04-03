import { computed } from "vue";

import type { Balance } from "@/store/zksync/lite/wallet";
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
      const balance =
        typeof balanceItem.price === "number"
          ? removeSmallAmount(balanceItem.amount, balanceItem.decimals, balanceItem.price)
          : parseTokenAmount(balanceItem.amount, balanceItem.decimals);
      if (!isOnlyZeroes(balance)) {
        groups.default.balances.push(balanceItem);
      } else if (balance === "0") {
        groups.zero.balances.push(balanceItem);
      } else {
        groups.small.balances.push(balanceItem);
      }
    }
    return [groups.default, groups.small, groups.zero].filter((group) => group.balances.length);
  });
