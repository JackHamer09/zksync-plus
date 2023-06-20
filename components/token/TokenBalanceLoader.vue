<template>
  <CommonButtonLineWithImg as="div" class="token-balance token-balance-loader">
    <template #image>
      <CommonContentLoader :length="0" class="token-balance-image-container" />
    </template>
    <template #default>
      <div class="token-info">
        <div class="token-symbol"><CommonContentLoader :length="10" /></div>
        <div class="token-address"><CommonContentLoader :length="28" /></div>
      </div>
    </template>
    <template #right>
      <div class="token-balance-side">
        <div class="token-balances">
          <div class="token-balance-amount"><CommonContentLoader :length="20" /></div>
          <div class="token-balance-price"><CommonContentLoader :length="20" /></div>
        </div>
        <CommonIconButton loading class="send-button" />
      </div>
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup>
defineProps({
  sendRouteName: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.token-balance-loader {
  @apply pointer-events-none;

  .token-balance-image-container {
    @apply block aspect-square rounded-full;
  }
}
</style>
