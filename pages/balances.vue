<template>
  <div>
    <CommonBackButton as="RouterLink" :to="{ name: 'index' }" />
    <h1 class="h1">Balances</h1>
    <CommonBadgeTabs class="mb-4" />

    <CommonContentBlock v-if="balanceInProgress">
      <div class="tokens-container">
        <div class="token-balances-container">
          <TokenBalanceLoader v-for="index in 2" :key="index" />
        </div>
      </div>
    </CommonContentBlock>
    <template v-else>
      <div v-for="(group, index) in displayedBalanceGroups" :key="index" class="category">
        <div v-if="group.title" class="category-title">{{ group.title }}</div>
        <CommonContentBlock>
          <div class="tokens-container">
            <div class="token-balances-container">
              <TokenBalance v-for="item in group.balances" :key="item.address" v-bind="item" />
            </div>
          </div>
        </CommonContentBlock>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { storeToRefs } from "pinia";

import type { Balance } from "@/store/zksync/lite/wallet";

import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { removeSmallAmount } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";

const { balance, balanceInProgress } = storeToRefs(useLiteWalletStore());

const displayedBalanceGroups = computed(() => {
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
  for (const balanceItem of balance.value) {
    const balance = removeSmallAmount(balanceItem.amount, balanceItem.decimals, balanceItem.price);
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
</script>

<style lang="scss" scoped>
.category {
  .category-title {
    @apply py-4 text-sm font-medium text-gray-secondary;
  }
}
.tokens-container {
  .token-balances-container {
    @apply -mx-3 -my-3;
  }
}
</style>
