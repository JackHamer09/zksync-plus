<template>
  <CommonButtonLineWithImg class="token-balance" :class="{ 'is-zero-amount': isZeroAmount }" :as="as">
    <template #image>
      <TokenImage class="token-balance-image-container" :symbol="symbol" :address="address" :icon-url="iconUrl" />
    </template>
    <template #default>
      <div class="token-info">
        <div class="token-symbol">{{ symbol }}</div>
        <div class="token-address hidden xs:block" :title="address">{{ shortenAddress(address, 5) }}</div>
        <div class="token-address xs:hidden" :title="address">{{ shortenAddress(address, 2) }}</div>
      </div>
    </template>
    <template #right>
      <div class="token-balance-side">
        <div class="token-balances">
          <div class="token-balance-amount" :title="fullAmount">
            <template v-if="priceLoading">
              <CommonContentLoader :length="15" />
            </template>
            <template v-else>{{ displayedAmount }}</template>
          </div>
          <div class="token-balance-price">
            <template v-if="priceLoading">
              <CommonContentLoader :length="12" />
            </template>
            <template v-else-if="price && !isZeroAmount">
              {{ formatTokenPrice(amount, decimals, price as number) }}
            </template>
          </div>
        </div>
        <CommonIconButton
          v-if="sendRouteName"
          as="RouterLink"
          :icon="PaperAirplaneIcon"
          :to="{ name: sendRouteName, query: { token: address } }"
          class="send-button"
        />
      </div>
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";

import type { TokenPrice } from "@/types";
import type { BigNumberish } from "ethers";
import type { Component, PropType } from "vue";

import { formatTokenPrice, parseTokenAmount, removeSmallAmount, shortenAddress } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";

const props = defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
  },
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
    type: [String, Number] as PropType<TokenPrice>,
  },
  sendRouteName: {
    type: String,
  },
});

const priceLoading = computed(() => props.price === "loading");
const isZeroAmount = computed(() => BigNumber.from(props.amount).isZero());

const fullAmount = computed(() => parseTokenAmount(props.amount, props.decimals));
const displayedAmount = computed(() => {
  if (typeof props.price !== "number") {
    return fullAmount.value;
  }
  const withoutSmallAmount = removeSmallAmount(props.amount, props.decimals, props.price);
  if (props.amountDisplay === "remove-small") {
    if (isZeroAmount.value) {
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
  @apply grid grid-cols-[35px_1fr_max-content] items-center gap-2.5 xs:grid-cols-[40px_1fr_max-content] xs:gap-4;
  &.is-zero-amount {
    .token-balance-amount,
    .send-button {
      @apply opacity-50;
    }
    .token-balance-amount {
      @apply text-gray-secondary;
    }
  }

  .token-balance-image-container {
    @apply h-auto w-full;
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
  .token-balance-side {
    @apply flex items-center;

    .token-balances {
      @apply w-max text-right;
    }
    .send-button {
      @apply ml-4 hidden xs:flex;
    }
  }
}
</style>
