<template>
  <CommonButtonLineWithImg class="transaction-line-item" :as="as">
    <template #image>
      <div class="transaction-line-item-icon-container">
        <component v-if="icon" :is="icon" class="transaction-line-item-icon" />
      </div>
    </template>
    <template #default>
      <div class="transaction-line-info">
        <slot name="top-left" />
        <slot name="bottom-left" />
        <!-- <div class="transaction-line-label-underline hidden xs:block" :title="transactionHash">
          {{ shortenAddress(transactionHash, 5) }}
        </div>
        <div class="transaction-line-label-underline xs:hidden" :title="transactionHash">
          {{ shortenAddress(transactionHash, 2) }}
        </div> -->
      </div>
    </template>
    <template #right>
      <div class="transaction-line-item-side">
        <div class="transaction-line-items">
          <slot name="top-right" />
          <slot name="bottom-right" />
        </div>
        <a
          v-tooltip="'Click to view on explorer'"
          :href="transactionUrl"
          target="_blank"
          class="view-on-explorer-button"
        >
          <ArrowUpRightIcon aria-hidden="true" />
        </a>
      </div>
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";

import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
  icon: {
    type: [String, Object, Function] as PropType<string | Component>,
  },
  transactionUrl: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss">
.transaction-line-item {
  @apply grid grid-cols-[35px_1fr_max-content] items-center gap-2.5 rounded-lg xs:grid-cols-[40px_1fr_max-content] xs:gap-4;

  .transaction-line-item-icon-container {
    @apply flex aspect-square h-auto w-full items-center justify-center rounded-full border border-primary-100 bg-primary-100/10;

    .transaction-line-item-icon {
      @apply h-4 w-4 text-primary-500;
    }
  }
  .transaction-line-info,
  .transaction-line-items {
    @apply flex flex-col justify-between whitespace-nowrap;

    .transaction-line-label,
    .transaction-line-item-amount {
      @apply leading-relaxed;
    }
    .transaction-line-label-underline,
    .transaction-line-item-price {
      @apply text-sm leading-tight text-gray-secondary;
    }
  }
  .transaction-line-info {
    @apply w-full;

    .transaction-line-label {
      @apply font-medium;
    }
  }
  .transaction-line-item-side {
    @apply flex items-center;

    .transaction-line-items {
      @apply w-max text-right;
    }
    .view-on-explorer-button {
      @apply ml-4 flex aspect-square h-9 w-auto items-center justify-center rounded-full bg-primary-100/50 transition-colors hover:bg-primary-100/75;

      svg {
        @apply h-4 w-4 text-primary-400;
      }
    }
  }
}
</style>
