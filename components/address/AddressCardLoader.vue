<template>
  <CommonButtonLineWithImg :as="as" class="address-card-loader">
    <template #image>
      <CommonContentLoader class="address-avatar-img" />
    </template>
    <template #default>
      <div class="address-card-info">
        <div class="address-card-name pb-1"><CommonContentLoader :length="36" /></div>
        <div class="address-card-address"><CommonContentLoader :length="26" /></div>
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
  .address-avatar-img {
    @apply block aspect-square h-full w-full rounded-full;
  }
}
</style>
