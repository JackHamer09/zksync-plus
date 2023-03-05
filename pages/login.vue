<template>
  <div class="login-page">
    <h1 class="h1 mb-2 text-center">Log in to zkSync Plus</h1>
    <button v-if="!account.address" @click="openModal" class="login-btn">
      <div class="login-btn-inner">
        <IconsEthereum class="mr-2 h-20 w-auto" />
        <div class="login-btn-description">Connect your Ethereum wallet to experience zkSync Plus</div>
        <ChevronRightIcon class="block h-6 w-6" aria-hidden="true" />
      </div>
    </button>
    <template v-else>
      <NuxtLink :to="{ name: 'index' }" class="login-btn">
        <div class="login-btn-inner">
          <div class="mr-2 flex h-20 items-center justify-center pr-0.5">
            <Web3Avatar class="h-10 w-10" :address="account.address" />
          </div>
          <div class="logged-in-address">{{ shortenAddress(account.address) }}</div>
          <ChevronRightIcon class="block h-6 w-6" aria-hidden="true" />
        </div>
      </NuxtLink>
      <CommonLabelButton class="mx-auto mt-6 -mb-[calc(24px_+_20px)] text-center" @click="useAnotherAccount">
        Use another account
      </CommonLabelButton>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ChevronRightIcon } from "@heroicons/vue/24/solid";
import Web3Avatar from "web3-avatar-vue";

import { definePageMeta } from "#imports";
import { account, disconnect, openModal } from "@/store/onboard";

definePageMeta({
  layout: "login",
});

const useAnotherAccount = async () => {
  await disconnect();
  await openModal();
};
</script>

<style lang="scss" scoped>
.login-page {
  @apply sm:pb-20;

  .login-btn {
    @apply mt-5 block w-full rounded-lg bg-white p-1 text-left text-gray-secondary transition-shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none;
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
      @apply text-xs font-light leading-tight sm:text-sm;
    }
    .logged-in-address {
      @apply text-left font-medium text-gray-700;
    }
  }
}
</style>
