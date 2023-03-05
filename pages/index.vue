<template>
  <div>
    <h1 class="h1">Home</h1>
    <CommonBadgeTabs class="mb-4" />
    <CommonContentBlock>
      <div class="total-balance">
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
          <CommonLabelButton>View all</CommonLabelButton>
        </div>
        <div class="token-balances-container">
          <TokenBalance
            v-for="item in displayedBalances"
            :key="item.address"
            :symbol="item.symbol"
            :address="item.address"
            :decimals="item.decimals"
            :amount="item.amount"
            :price="item.price"
          />
        </div>
      </div>
    </CommonContentBlock>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { PaperAirplaneIcon, PlusIcon } from "@heroicons/vue/24/outline";

import { parseTokenAmount, removeSmallAmount } from "@/utils/formatters";

const balances = computed(() => [
  {
    symbol: "ETH",
    address: "0x00000000000000000000000",
    decimals: 18,
    amount: "17500000000000000",
    price: 1600,
  },
  {
    symbol: "DAI",
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    decimals: 18,
    amount: "6831310000000000",
    price: 1,
  },
  {
    symbol: "USDT",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 18,
    amount: "280000000000",
    price: 1,
  },
]);

const total = computed(() => {
  const num = balances.value.reduce(
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
  return balances.value.filter(({ amount, decimals, price }) => {
    if (removeSmallAmount(amount, decimals, price) !== "0.0000") {
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
