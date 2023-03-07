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
    <button class="send-button">
      <PaperAirplaneIcon aria-hidden="true" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";

import type { BigNumberish } from "ethers";

defineProps<{
  symbol: string;
  address: string;
  decimals: number;
  amount: BigNumberish;
  price: number;
}>();
</script>

<style lang="scss">
.token-balance {
  @apply grid cursor-pointer grid-cols-[40px_1fr_max-content] items-center gap-4 rounded-lg p-2 transition-colors hover:bg-gray-50 xs:grid-cols-[40px_1fr_max-content_35px];

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
  .send-button {
    @apply hidden aspect-square w-full items-center justify-center rounded-full bg-primary-100/50 transition-colors hover:bg-primary-100/75 xs:flex;

    svg {
      @apply h-4 w-4 text-primary-400;
    }
  }
}
</style>
