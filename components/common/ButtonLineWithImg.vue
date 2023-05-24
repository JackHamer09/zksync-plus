<template>
  <CommonLineButton :as="as" class="button-line-with-img" :class="{ 'has-right': $slots.right }">
    <div class="button-line-with-img-image">
      <slot name="image" />
    </div>
    <div class="button-line-with-img-body">
      <slot />
    </div>
    <div v-if="$slots.right" class="button-line-with-img-right">
      <slot name="right" />
    </div>
  </CommonLineButton>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
  },
});
</script>

<style lang="scss">
.button-line-with-img {
  @apply grid grid-cols-[35px_1fr] items-center gap-2.5 xs:grid-cols-[40px_1fr] xs:gap-4;
  &.has-right {
    @apply grid-cols-[35px_1fr_max-content] xs:grid-cols-[40px_1fr_max-content];
  }

  .button-line-with-img-image {
    @apply aspect-square h-auto w-full;
  }
  .button-line-with-img-body {
    @apply w-full overflow-hidden;
  }
  .button-line-with-img-right {
    @apply w-max;
  }
}
</style>
