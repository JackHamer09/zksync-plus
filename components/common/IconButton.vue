<template>
  <component :is="as" type="button" class="icon-button" :class="`variant-${variant}`">
    <component :is="icon" class="icon" aria-hidden="true" />
  </component>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
  icon: {
    type: [Object, Function] as PropType<Component>,
    required: true,
  },
  variant: {
    type: String as PropType<"primary" | "primary-solid" | "error">,
    default: "primary",
  },
});
</script>

<style lang="scss">
.icon-button {
  @apply flex aspect-square h-9 w-auto items-center justify-center rounded-full transition-colors;
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
      @apply bg-primary-400 text-base text-white;
      &:enabled,
      &:is(a) {
        &:not([aria-disabled="true"]) {
          @apply hover:bg-primary-400;
        }
      }
      &:disabled {
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

  .icon {
    @apply h-4 w-4;
  }
}
</style>
