<template>
  <div class="token-balance">
    <TokenImage class="token-image" :address="address" />
    <div class="token-info">
      <div class="token-symbol">{{ symbol }}</div>
      <div class="token-address">{{ shortenAddress(address, 5) }}</div>
    </div>
    <div class="token-balances">
      <div class="token-balance-amount">{{ symbol }} {{ removeSmallAmount(amount, decimals, price) }}</div>
      <div class="token-balance-price">{{ formatTokenPrice(amount, decimals, price) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BigNumberish } from "ethers";

defineProps<{
  symbol: string;
  address: string;
  decimals: number;
  amount: BigNumberish;
  price: number;
}>();
</script>

<style lang="scss" scoped>
.token-balance {
  @apply grid cursor-pointer grid-cols-[40px_1fr_max-content] items-center gap-4 rounded-lg p-2 transition-colors hover:bg-gray-50;

  .token-image {
    @apply h-10 w-10;
  }
  .token-info,
  .token-balances {
    @apply flex flex-col justify-between whitespace-nowrap;

    .token-symbol,
    .token-balance-amount {
      @apply leading-relaxed;
    }
    .token-address,
    .token-balance-price {
      @apply text-sm leading-tight text-gray-secondary;
    }
  }
  .token-info {
    @apply w-full;

    .token-symbol {
      @apply font-medium;
    }
  }
  .token-balances {
    @apply w-max text-right;
  }
}
</style>
