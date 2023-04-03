<template>
  <component :is="as" class="back-button-container">
    <ArrowLeftIcon class="arrow-icon" aria-hidden="true" />
  </component>
</template>

<script lang="ts" setup>
import { ArrowLeftIcon } from "@heroicons/vue/24/solid";

import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
});
</script>

<style lang="scss" scoped>
.back-button-container {
  @apply block pt-8 text-black transition-colors hover:text-gray-600;

  .arrow-icon {
    @apply h-6 w-6;
  }
}
</style>
