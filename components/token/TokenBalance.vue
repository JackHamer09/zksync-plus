<template>
  <CommonLineButton class="token-balance">
    <TokenImage class="token-balance-image-container" :symbol="symbol" :address="address" :icon-url="iconUrl" />
    <div class="token-info">
      <div class="token-symbol">{{ symbol }}</div>
      <div class="token-address" :title="address">{{ shortenAddress(address, 5) }}</div>
    </div>
    <div class="token-balances">
      <div class="token-balance-amount" :title="fullAmount">{{ symbol }} {{ displayedAmount }}</div>
      <div class="token-balance-price">{{ formatTokenPrice(amount, decimals, price) }}</div>
    </div>
    <NuxtLink :to="{ name: 'transaction-send', query: { token: address } }" class="send-button">
      <PaperAirplaneIcon aria-hidden="true" />
    </NuxtLink>
  </CommonLineButton>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";

import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { parseTokenAmount, removeSmallAmount, shortenAddress } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";

const props = defineProps({
  amountDisplay: {
    type: String as PropType<"remove-small" | "full">,
    default: "remove-small",
  },
  symbol: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  decimals: {
    type: Number,
    required: true,
  },
  iconUrl: {
    type: String,
  },
  amount: {
    type: String as PropType<BigNumberish>,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const fullAmount = computed(() => parseTokenAmount(props.amount, props.decimals));
const displayedAmount = computed(() => {
  const withoutSmallAmount = removeSmallAmount(props.amount, props.decimals, props.price);
  if (props.amountDisplay === "remove-small") {
    if (props.amount === "0") {
      return "0";
    } else if (!isOnlyZeroes(withoutSmallAmount)) {
      return withoutSmallAmount;
    }
    return `<${withoutSmallAmount.slice(0, -1)}1`;
  }
  return fullAmount.value;
});
</script>

<style lang="scss">
.token-balance {
  @apply grid grid-cols-[40px_1fr_max-content] items-center gap-4 rounded-lg p-2 xs:grid-cols-[40px_1fr_max-content_35px];

  .token-balance-image-container {
    @apply h-full w-auto;
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
