<template>
  <div class="login-page">
    <h1 class="h1 mb-2 text-center">Log in to zkSync Plus</h1>
    <button @click="openModal" class="login-btn">
      <div class="login-btn-inner">
        <IconsEthereum class="mr-2 h-14 w-auto md:h-20" />
        <div class="login-btn-description">Connect your Ethereum wallet to experience zkSync Plus</div>
        <ChevronRightIcon class="h-8 w-8" aria-hidden="true" />
      </div>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ChevronRightIcon } from "@heroicons/vue/24/solid";

import { definePageMeta } from "#imports";
import { openModal } from "@/store/useOnboard";

definePageMeta({
  layout: "login",
});
</script>

<style lang="scss" scoped>
.login-page {
  .login-btn {
    @apply mt-5 w-full rounded-lg bg-white p-1 text-left text-gray-secondary transition-shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none;
    &:hover:not(:disabled) {
      @apply shadow-sm;

      .login-btn-inner {
        @apply bg-gray-50;
      }
    }

    .login-btn-inner {
      @apply flex w-full items-center justify-between gap-2.5 rounded-lg px-5 pr-6 transition-colors;
    }
    .login-btn-description {
      @apply text-sm font-light leading-tight;
    }
  }
}
</style>
