<template>
  <div class="badge-tabs-container">
    <NuxtLink :to="eraUrl" class="badge-tab">zkSync Era∎</NuxtLink>
    <NuxtLink :to="liteUrl" class="badge-tab">zkSync Lite</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

defineProps({
  eraUrl: {
    type: Object as PropType<RouteLocationRaw>,
    required: true,
  },
  liteUrl: {
    type: Object as PropType<RouteLocationRaw>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.badge-tabs-container {
  @apply grid w-full grid-flow-col-dense grid-cols-[max-content] gap-2;

  .badge-tab {
    @apply w-max cursor-pointer whitespace-nowrap rounded-xl py-1 px-4 text-sm font-medium leading-loose text-gray-secondary transition-colors;
    &:hover,
    &.router-link-exact-active {
      @apply text-black;
    }
    &.router-link-exact-active {
      @apply bg-white;
    }
  }
}
</style>
