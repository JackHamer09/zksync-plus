<template>
  <component :is="as" type="button" class="default-button" :class="`color-${color}`">
    <span v-if="$slots.icon" class="icon-container">
      <slot name="icon" />
    </span>
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

defineProps({
  as: {
    type: String,
    default: "button",
  },
  color: {
    type: String as PropType<"primary" | "error">,
    default: "primary",
  },
});
</script>

<style lang="scss">
.default-button {
  @apply flex h-[2.25rem] w-max items-center justify-center rounded-[10px] px-4 text-sm font-medium transition-colors;
  &:enabled:not([aria-disabled="true"]) {
    @apply hover:bg-primary-100/75;
  }
  &.color- {
    &primary {
      @apply bg-primary-100/50 text-primary-400;
      &:enabled:not([aria-disabled="true"]) {
        @apply hover:bg-primary-100/75;
      }
    }
    &error {
      @apply bg-red-100/50 text-red-400;
      &:enabled:not([aria-disabled="true"]) {
        @apply hover:bg-red-100/75;
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
