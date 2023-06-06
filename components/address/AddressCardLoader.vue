<template>
  <CommonButtonLineWithImg :as="as" class="address-card-loader">
    <template #image>
      <div class="address-avatar">
        <CommonContentLoader class="address-avatar-img" />
      </div>
    </template>
    <template #default>
      <div class="address-card-loader-info">
        <div class="address-card-loader-name"><CommonContentLoader :length="36" /></div>
        <div class="address-card-loader-address"><CommonContentLoader :length="26" /></div>
      </div>
    </template>
  </CommonButtonLineWithImg>
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
.address-card-loader {
  @apply pointer-events-none select-none;
  .address-card-loader-avatar {
    @apply aspect-square h-auto w-full;
  }
  .address-card-loader-info {
    @apply flex w-full flex-col justify-between whitespace-nowrap;

    .address-card-loader-name {
      @apply overflow-hidden text-ellipsis font-medium leading-relaxed;
    }
    .address-card-loader-address {
      @apply text-sm leading-tight text-gray-secondary;
    }
  }
  .address-avatar {
    @apply relative;

    .address-avatar-img {
      @apply block aspect-square h-full w-full rounded-full;
    }
  }
}
</style>
