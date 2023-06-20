<template>
  <component :is="as" type="button" class="label-button">
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
.label-button {
  @apply block text-sm font-medium text-primary-400 transition-colors;
  &:enabled,
  &:is(a) {
    &:not([aria-disabled="true"]) {
      @apply hover:text-primary-300;
    }
  }
}
</style>
