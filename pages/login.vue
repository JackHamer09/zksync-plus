<template>
  <div class="login-page">
    <h1 class="h1 mb-2 text-center">Log in to zkSync Plus</h1>
    <button @click="connect" class="login-btn">
      <IconsMetaMaskAnimated svg-classes="h-12 w-12 h-16 md:w-16" class="mr-2 h-12 w-auto md:h-16" />
      <div>
        <div class="login-btn-description">Connect your Ethereum wallet to experience zkSync Plus</div>
      </div>
    </button>
  </div>
</template>

<script lang="ts" setup>
import useOnboard from "@/composables/useOnboard";

import { definePageMeta } from "#imports";

definePageMeta({
  layout: "login",
});

const { connectWallet } = useOnboard();

function connect() {
  connectWallet();
}
</script>

<style lang="scss" scoped>
.login-page {
  .login-btn {
    @apply mt-5 flex w-full items-center justify-between gap-2.5 rounded-lg border bg-white py-3 px-5 pr-6 text-left shadow-sm transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:shadow-none;
    .login-btn-description {
      @apply text-sm font-light leading-tight text-gray-secondary;
    }
  }
}
</style>
