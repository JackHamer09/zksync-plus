<template>
  <CommonLineButton :as="as" class="address-card">
    <AddressAvatar class="address-card-avatar" :address="address">
      <template v-if="$slots['address-icon']" #icon>
        <slot name="address-icon" />
      </template>
    </AddressAvatar>
    <div class="address-card-info">
      <div v-if="name" class="address-card-name">{{ name }}</div>
      <div class="address-card-address" :title="address">{{ shortenAddress(address) }}</div>
    </div>
    <div v-if="$slots.icon" class="icon-container">
      <slot name="icon" />
    </div>
  </CommonLineButton>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss">
.address-card {
  @apply grid grid-cols-[35px_1fr_max-content] items-center gap-2.5 xs:grid-cols-[40px_1fr_max-content] xs:gap-4;

  .address-card-avatar {
    @apply aspect-square h-auto w-full;
  }
  .address-card-info {
    @apply flex w-full flex-col justify-between overflow-hidden whitespace-nowrap;

    .address-card-name {
      @apply overflow-hidden text-ellipsis font-medium leading-relaxed;
    }
    .address-card-address {
      @apply text-sm leading-tight text-gray-secondary;
    }
  }
  .icon-container {
    @apply flex items-center justify-center;

    svg {
      @apply block h-6 w-6;
    }
  }
}
</style>
