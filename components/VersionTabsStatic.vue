<template>
  <div class="badge-tabs-container">
    <div class="badge-tab" :class="{ active: version === 'era' }" @click="preferencesStore.setVersion('era')">
      zkSync Era∎
    </div>
    <div class="badge-tab" :class="{ active: version === 'lite' }" @click="preferencesStore.setVersion('lite')">
      zkSync Lite
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { usePreferencesStore } from "@/store/preferences";

const preferencesStore = usePreferencesStore();
const { version } = storeToRefs(preferencesStore);
</script>

<style lang="scss" scoped>
.badge-tabs-container {
  @apply grid w-full grid-flow-col-dense grid-cols-[max-content] gap-2;

  .badge-tab {
    @apply w-max cursor-pointer whitespace-nowrap rounded-xl py-1 px-4 text-sm font-medium leading-loose text-gray-secondary transition-colors;
    &:hover,
    &.active {
      @apply text-black;
    }
    &.active {
      @apply bg-white;
    }
  }
}
</style>
