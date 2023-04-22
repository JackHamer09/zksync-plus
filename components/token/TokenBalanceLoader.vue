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
        <div v-if="showSendButton" class="send-button">
          <CommonContentLoader class="send-button-loader" />
        </div>
      </div>
    </template>
  </CommonButtonLineWithImg>
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
    @apply block aspect-square rounded-full;
  }
  .send-button {
    @apply bg-transparent;

    .send-button-loader {
      @apply block aspect-square h-full w-full rounded-full;
    }
  }
}
.token-balance {
  @apply grid grid-cols-[35px_1fr_max-content] items-center gap-2.5 rounded-lg xs:grid-cols-[40px_1fr_max-content] xs:gap-4;

  .token-balance-image-container {
    @apply h-auto w-full;
  }
  .token-info,
  .token-balances {
    @apply flex flex-col justify-between whitespace-nowrap;

    .token-symbol,
    .token-balance-amount {
      @apply leading-relaxed;
    }
    .token-address,
    .token-balance-price {
      @apply text-sm leading-tight;
    }
  }
  .token-info {
    @apply w-full;
  }
  .token-balance-side {
    @apply flex items-center;

    .token-balances {
      @apply w-max text-right;
    }
    .send-button {
      @apply ml-4 hidden aspect-square h-9 w-auto rounded-full transition-colors xs:block;
    }
  }
}
</style>
