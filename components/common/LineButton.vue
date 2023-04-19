<template>
  <component :is="as" class="line-button-container">
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
});
</script>

<style lang="scss" scoped>
.line-button-container {
  @apply h-[59.5px] w-full rounded-lg p-2 transition-colors;
  text-align: inherit;
  &:enabled,
  &:is(a) {
    &:not([aria-disabled="true"]) {
      @apply cursor-pointer hover:bg-gray-50;
    }
  }
  &:disabled,
  &[aria-disabled="true"] {
    @apply cursor-not-allowed opacity-75;
  }
}
</style>
