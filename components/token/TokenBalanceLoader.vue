<template>
  <div class="token-balance token-balance-loader">
    <CommonContentLoader class="token-image-container token-image-loader" />
    <div class="token-info">
      <div class="token-symbol"><CommonContentLoader :length="10" /></div>
      <div class="token-address"><CommonContentLoader :length="28" /></div>
    </div>
    <div class="token-balances">
      <div class="token-balance-amount"><CommonContentLoader :length="20" /></div>
      <div class="token-balance-price"><CommonContentLoader :length="15" /></div>
    </div>
    <div class="send-button">
      <CommonContentLoader class="send-button-loader" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.token-balance-loader {
  @apply pointer-events-none;

  .token-image-loader {
    @apply rounded-full;
  }
  .send-button {
    @apply bg-transparent;

    .send-button-loader {
      @apply block h-full w-full rounded-full;
    }
  }
}
</style>
