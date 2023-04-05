<template>
  <CommonLineButton class="token-balance token-balance-loader">
    <CommonContentLoader :length="0" class="token-balance-image-container" />
    <div class="token-info">
      <div class="token-symbol"><CommonContentLoader :length="10" /></div>
      <div class="token-address"><CommonContentLoader :length="28" /></div>
    </div>
    <div class="token-balances">
      <div class="token-balance-amount"><CommonContentLoader :length="20" /></div>
      <div class="token-balance-price"><CommonContentLoader :length="15" /></div>
    </div>
    <div v-if="showSendButton" class="send-button">
      <CommonContentLoader class="send-button-loader" />
    </div>
  </CommonLineButton>
</template>

<script lang="ts" setup>
defineProps({
  showSendButton: {
    type: Boolean,
    default: true,
  },
});
</script>
<style lang="scss" scoped>
.token-balance-loader {
  @apply pointer-events-none;

  .token-balance-image-container {
    @apply aspect-square rounded-full;
  }
  .send-button {
    @apply bg-transparent;

    .send-button-loader {
      @apply block aspect-square h-full w-full rounded-full;
    }
  }
}
</style>
