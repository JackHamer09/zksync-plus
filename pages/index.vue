<template>
  <div>
    <h1 class="h1">Home</h1>
    <CommonBadgeTabs class="mb-4" />
    <CommonContentBlock>
      <div v-if="balanceInProgress" class="total-balance">
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
        <CommonButton>
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
          <template v-if="balanceInProgress">
            <TokenBalanceLoader v-for="index in 2" :key="index" />
          </template>
          <template v-else>
            <TokenBalance
              v-for="item in displayedBalances"
              :key="item.address"
              :symbol="item.symbol"
              :address="item.address"
              :decimals="item.decimals"
              :amount="item.amount"
              :price="item.price"
            />
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

import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { parseTokenAmount, removeSmallAmount } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";

const { balance, balanceInProgress } = storeToRefs(useLiteWalletStore());

const total = computed(() => {
  const num = balance.value.reduce(
    (acc, { amount, decimals, price }) => acc + parseFloat(parseTokenAmount(amount, decimals)) * price,
    0
  );
  return {
    int: Math.floor(num),
    dec: (num % 1).toFixed(2).slice(2),
    currencySymbol: "$",
  };
});

const displayedBalances = computed(() => {
  return balance.value.filter(({ amount, decimals, price }) => {
    if (!isOnlyZeroes(removeSmallAmount(amount, decimals, price))) {
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
    @apply -mx-3 -mb-3;
  }
}
</style>
