<template>
  <div>
    <CommonBackButton as="RouterLink" :to="{ name: 'index' }" />
    <h1 class="h1">Balances</h1>
    <CommonBadgeTabs class="mb-4" />

    <CommonCardWithLineButtons v-if="balanceInProgress || !allPricesLoaded">
      <TokenBalanceLoader v-for="index in 2" :key="index" />
    </CommonCardWithLineButtons>
    <CommonCardWithLineButtons v-else-if="balanceError">
      <CommonErrorBlock class="m-2" @try-again="fetch">
        {{ balanceError.message }}
      </CommonErrorBlock>
    </CommonCardWithLineButtons>
    <template v-else>
      <div v-for="(group, index) in displayedBalanceGroups" :key="index" class="category">
        <TypographyCategoryLabel v-if="group.title" class="group-category-label">
          {{ group.title }}
        </TypographyCategoryLabel>
        <CommonCardWithLineButtons>
          <TokenBalance v-for="item in group.balances" :key="item.address" v-bind="item" />
        </CommonCardWithLineButtons>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { storeToRefs } from "pinia";

import type { Balance } from "@/store/zksync/lite/wallet";

import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { parseTokenAmount, removeSmallAmount } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";

const walletLiteStore = useLiteWalletStore();
const { balance, balanceInProgress, balanceError } = storeToRefs(walletLiteStore);

const allPricesLoaded = computed(() => !balance.value.some((e) => e.price === "loading"));

const fetch = () => {
  walletLiteStore.requestBalance();
};
fetch();

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
</script>

<style lang="scss" scoped>
.group-category-label:first-child {
  @apply pt-0;
}
</style>
