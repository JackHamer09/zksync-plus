<template>
  <div class="token-image">
    <div class="token-placeholder"></div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  address: string;
}>();
</script>

<style lang="scss" scoped>
.token-image {
  .token-placeholder {
    @apply relative h-full w-full rounded-full border border-dashed;
    &::before {
      content: "";
      @apply absolute inset-0 m-[3px] rounded-full bg-gray-100;
    }
  }
}
</style>
