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
  @apply flex h-[2.25rem] w-max items-center justify-center rounded-[10px] px-4 text-sm font-medium backdrop-blur-sm transition-colors;
  &.variant- {
    &primary {
      @apply bg-primary-100/50 text-primary-400;
      &:enabled,
      &:is(a) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-primary-100/75;
        }
      }
    }
    &primary-solid {
      @apply h-12 w-full max-w-sm rounded-2xl bg-primary-400 text-base text-white;
      &:enabled,
      &:is(a) {
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
      &:is(a) {
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
