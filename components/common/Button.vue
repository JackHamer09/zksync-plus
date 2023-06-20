<template>
  <component :is="as" type="button" class="default-button" :class="`variant-${variant}`">
    <span v-if="$slots.icon" class="icon-container">
      <slot name="icon" />
    </span>
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
  variant: {
    type: String as PropType<"primary" | "primary-solid" | "error">,
    default: "primary",
  },
});
</script>

<style lang="scss">
.default-button {
  @apply flex h-[3rem] w-max items-center justify-center rounded-3xl px-4 text-sm font-medium backdrop-blur-sm transition-colors;
  &:is(label) {
    @apply cursor-pointer;
  }
  &.variant- {
    &primary {
      @apply whitespace-nowrap bg-primary-100/50 text-primary-400;
      @apply dark:bg-primary-300 dark:text-white;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-primary-100/75 dark:hover:bg-primary-200;
        }
      }
    }
    &primary-solid {
      @apply h-max w-full max-w-sm rounded-3xl bg-primary-400 py-3 text-base text-white;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-primary-400;
        }
      }
      &:disabled,
      &[aria-disabled="true"] {
        @apply bg-opacity-50;
      }
    }
    &error {
      @apply bg-red-100/50 text-red-400;
      &:enabled,
      &:is(a, label) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-red-100/75;
        }
      }
    }
  }
  .icon-container {
    @apply -ml-0.5 mr-2 inline-flex items-center;

    svg {
      @apply block h-4 w-4;
    }
  }
}
</style>
