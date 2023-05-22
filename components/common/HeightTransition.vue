<template>
  <div class="height-transition" :class="{ 'is-opened': opened }">
    <div class="height-transition-inner">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  opened: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.height-transition {
  @apply grid grid-rows-[0fr] transition-all;
  &.is-opened {
    @apply grid-rows-[1fr];

    .height-transition-inner {
      @apply opacity-100;
    }
  }

  .height-transition-inner {
    @apply overflow-hidden opacity-0 transition-opacity;
  }
}
</style>
