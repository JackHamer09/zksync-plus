<template>
  <div class="token-balance">
    <TokenImage class="token-image-container" :symbol="symbol" :address="tokenIconAddress" :key="tokenIconAddress" />
    <div class="token-info">
      <div class="token-symbol">{{ symbol }}</div>
      <div class="token-address" :title="address">{{ shortenAddress(address, 5) }}</div>
    </div>
    <div class="token-balances">
      <div class="token-balance-amount" :title="fullAmount">{{ symbol }} {{ displayedAmount }}</div>
      <div class="token-balance-price">{{ formatTokenPrice(amount, decimals, price) }}</div>
    </div>
    <button class="send-button">
      <PaperAirplaneIcon aria-hidden="true" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { useNetworkStore } from "@/store/network";
import { parseTokenAmount, removeSmallAmount, shortenAddress } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";
import { testnetToMainnetTokenAddress } from "~~/utils/tokens/lite";

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
  amount: {
    type: String as PropType<BigNumberish>,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  zksync: {
    type: String as PropType<"lite" | "era">,
    default: "lite",
  },
});

const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

const tokenIconAddress = computed(() => {
  if (props.zksync === "lite" && selectedEthereumNetwork.value.name !== "mainnet") {
    return testnetToMainnetTokenAddress(props.address, selectedEthereumNetwork.value.id) ?? props.address;
  }
  return props.address;
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
  @apply grid cursor-pointer grid-cols-[40px_1fr_max-content] items-center gap-4 rounded-lg p-2 transition-colors hover:bg-gray-50 xs:grid-cols-[40px_1fr_max-content_35px];

  .token-image-container {
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
