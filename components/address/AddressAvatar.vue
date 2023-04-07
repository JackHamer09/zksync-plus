<template>
  <div class="address-avatar">
    <Web3Avatar class="address-avatar-img" :address="address" />
    <div v-if="$slots.icon" class="address-avatar-icon">
      <slot name="icon" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Web3Avatar from "web3-avatar-vue";

defineProps({
  address: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss">
.address-avatar {
  @apply relative;

  .address-avatar-img {
    @apply h-full w-full;
  }
  .address-avatar-icon {
    @apply absolute -bottom-1 -right-1 aspect-square h-2/4 w-2/4 rounded-full bg-white bg-opacity-80 shadow-sm backdrop-blur-sm;

    img,
    svg {
      @apply h-full w-full object-contain;
    }
  }
}
</style>
