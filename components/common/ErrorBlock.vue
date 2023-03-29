<template>
  <div class="error-block-container">
    <FaceFrownIcon class="error-block-icon" aria-hidden="true" />
    <div class="error-block-text-container">
      <slot>Unexpected error</slot>
    </div>
    <CommonButton color="error" @click="emit('try-again')">Try again</CommonButton>
  </div>
</template>

<script lang="ts" setup>
import { FaceFrownIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits<{
  (eventName: "try-again"): void;
}>();
</script>

<style lang="scss" scoped>
.error-block-container {
  @apply grid grid-cols-[max-content_1fr_max-content] items-center rounded-lg border border-dashed border-red-500 p-2 text-red-500;

  .error-block-icon {
    @apply mr-3 block h-7 w-7;
  }
  .error-block-text-container {
    @apply whitespace-pre-line;
  }
}
</style>
