<template>
  <CommonButtonLineWithImg class="transaction-line-item" as="a" :href="transactionUrl" target="_blank">
    <template #image>
      <div class="transaction-line-item-icon-container">
        <XMarkIcon v-if="failed" class="transaction-line-item-icon failed-badge-icon" aria-hidden="true" />
        <component v-else-if="icon" :is="icon" class="transaction-line-item-icon" aria-hidden="true" />
      </div>
    </template>
    <template #default>
      <div class="transaction-line-info">
        <slot name="top-left" />
        <div v-if="failed" class="transaction-line-label-underline failed">Failed</div>
        <slot v-else name="bottom-left" />
      </div>
    </template>
    <template #right>
      <div class="transaction-line-item-side">
        <div class="transaction-line-items">
          <slot name="top-right" />
          <slot name="bottom-right" />
        </div>
        <ArrowUpRightIcon class="transaction-line-item-side-icon" aria-hidden="true" />
      </div>
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon, XMarkIcon } from "@heroicons/vue/24/outline";

import type { Component, PropType } from "vue";

defineProps({
  icon: {
    type: [String, Object, Function] as PropType<string | Component>,
  },
  transactionUrl: {
    type: String,
    required: true,
  },
  failed: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.transaction-line-item {
  @apply grid grid-cols-[35px_1fr_max-content] items-center gap-2.5 rounded-lg xs:grid-cols-[40px_1fr_max-content] xs:gap-4;

  .transaction-line-item-icon-container {
    @apply relative flex aspect-square h-auto w-full items-center justify-center rounded-full border border-primary-100 bg-primary-100/10 dark:border-none;

    .transaction-line-item-icon {
      @apply h-4 w-4 text-primary-500 dark:text-white;
      &.failed-badge-icon {
        @apply h-5 w-5 text-red-500;
      }
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

    .transaction-line-label-underline.failed {
      @apply text-red-500;
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
    .transaction-line-item-side-icon {
      @apply mr-3 ml-5 h-4 w-4 text-gray-secondary;
    }
  }
}
</style>
