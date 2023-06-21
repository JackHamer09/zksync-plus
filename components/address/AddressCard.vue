<template>
  <CommonButtonLineWithImg :as="as" class="address-card">
    <template #image>
      <AddressAvatar class="address-card-avatar" :address="address">
        <template v-if="$slots['address-icon']" #icon>
          <slot name="address-icon" />
        </template>
      </AddressAvatar>
    </template>
    <template #default>
      <div class="address-card-info" data-testid="your-account">
        <div v-if="name" class="address-card-name">{{ name }}</div>
        <div class="address-card-address" :title="address">{{ shortenAddress(address) }}</div>
      </div>
    </template>
    <template #right v-if="$slots.icon">
      <div class="icon-container">
        <slot name="icon" />
      </div>
    </template>
    <template #right v-else-if="$slots.right">
      <slot name="right" />
    </template>
  </CommonButtonLineWithImg>
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
  .address-card-avatar {
    @apply aspect-square h-auto w-full;
  }
  .address-card-info {
    @apply flex w-full flex-col justify-between whitespace-nowrap;

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
