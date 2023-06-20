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
  @apply h-[59.5px] w-full rounded-[1.24rem] p-2 transition-colors dark:bg-neutral-900;
  text-align: inherit;
  &:enabled,
  &:is(a) {
    &:not([aria-disabled="true"]) {
      @apply cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800;
    }
  }
  &:disabled,
  &[aria-disabled="true"] {
    @apply cursor-not-allowed opacity-75;
  }
}
</style>
