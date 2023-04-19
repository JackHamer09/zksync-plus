<template>
  <div>
    <h1 class="h1">Home</h1>
    <CommonBadgeTabs class="mb-4" />
    <CommonContentBlock>
      <div v-if="balanceInProgress || !allBalancePricesLoaded" class="total-balance">
        <CommonContentLoader />
      </div>
      <div v-else class="total-balance">
        <span class="currency-symbol">{{ total.currencySymbol }}</span>
        <span class="total-int">{{ total.int }}</span>
        <span class="total-dec">.{{ total.dec }}</span>
      </div>
      <CommonButtonsLineGroup class="my-4">
        <CommonButton>
          <template #icon>
            <PlusIcon aria-hidden="true" />
          </template>
          <template #default>Add money</template>
        </CommonButton>
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-lite' }">
          <template #icon>
            <PaperAirplaneIcon aria-hidden="true" />
          </template>
          <template #default>Send</template>
        </CommonButton>
      </CommonButtonsLineGroup>
      <div class="tokens-container">
        <div class="flex items-center justify-between py-4">
          <h2 class="text-sm text-gray-secondary">Balances</h2>
          <CommonLabelButton as="RouterLink" :to="{ name: 'balances' }">View all</CommonLabelButton>
        </div>
        <div class="token-balances-container">
          <template v-if="balanceInProgress || !allBalancePricesLoaded">
            <TokenBalanceLoader v-for="index in 2" :key="index" />
          </template>
          <CommonErrorBlock v-else-if="balanceError" class="m-3 mb-2.5 -mt-1" @try-again="fetch">
            {{ balanceError.message }}
          </CommonErrorBlock>
          <template v-else-if="displayedBalances.length">
            <TokenBalance v-for="item in displayedBalances" as="div" :key="item.address" v-bind="item" />
          </template>
          <template v-else>
            <CommonEmptyBlock class="mx-3 mb-3 mt-1">
              You don't have any balances on <span class="font-medium">{{ destinations.zkSyncLite.label }}</span> (L2)
              <br />
              <span class="mt-1.5 inline-block">
                Proceed to <NuxtLink class="link" :to="{ name: 'balances' }">balances</NuxtLink> to add balance to your
                account
              </span>
            </CommonEmptyBlock>
          </template>
        </div>
      </div>
    </CommonContentBlock>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { PaperAirplaneIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { parseTokenAmount, removeSmallAmount } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";

const walletLiteStore = useLiteWalletStore();
const { balance, balanceInProgress, balanceError, allBalancePricesLoaded } = storeToRefs(walletLiteStore);
const { destinations } = storeToRefs(useDestinationsStore());

const fetch = () => {
  walletLiteStore.requestBalance();
};
fetch();

const total = computed(() => {
  if (balanceError.value) {
    return {
      int: "?",
      dec: "??",
      currencySymbol: "$",
    };
  }
  const num = balance.value.reduce((acc, { amount, decimals, price }) => {
    if (typeof price !== "number") return acc;
    return acc + parseFloat(parseTokenAmount(amount, decimals)) * price;
  }, 0);
  return {
    int: Math.floor(num),
    dec: (num % 1).toFixed(2).slice(2),
    currencySymbol: "$",
  };
});

const displayedBalances = computed(() => {
  return balance.value.filter(({ amount, decimals, price }) => {
    const decimalAmount =
      typeof price === "number" ? removeSmallAmount(amount, decimals, price) : parseTokenAmount(amount, decimals);
    if (!isOnlyZeroes(decimalAmount)) {
      return true;
    }
    return false;
  });
});
</script>

<style lang="scss" scoped>
.total-balance {
  @apply text-[32px] font-semibold;

  .total-dec {
    @apply text-xl font-bold tracking-[0.1px];
  }
}
.tokens-container {
  .token-balances-container {
    @apply -mx-3 -mt-1 -mb-3;
  }
}
</style>
