<template>
  <div class="login-view isolate">
    <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
      <svg
        class="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
        viewBox="0 0 1155 678"
      >
        <path
          fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
          fill-opacity=".3"
          d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
        />
        <defs>
          <linearGradient
            id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
            x1="1155.49"
            x2="-78.208"
            y1=".177"
            y2="474.645"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#9089FC" />
            <stop offset="1" stop-color="#FF80B5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div
      class="absolute inset-x-0 top-[calc(100%-22rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-43rem)]"
    >
      <svg
        class="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
        viewBox="0 0 1155 678"
      >
        <path
          fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
          fill-opacity=".3"
          d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
        />
        <defs>
          <linearGradient
            id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
            x1="1155.49"
            x2="-78.208"
            y1=".177"
            y2="474.645"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#9089FC" />
            <stop offset="1" stop-color="#FF80B5" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <h1 class="h1 text-center">Log in to zkSync Plus</h1>
    <button v-if="!account.address" autofocus class="login-btn" @click="onboardStore.openModal">
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
            <AddressAvatar class="h-10 w-10" :address="account.address" />
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
import { storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";
import { shortenAddress } from "@/utils/formatters";

const onboardStore = useOnboardStore();
const { account } = storeToRefs(onboardStore);

const useAnotherAccount = async () => {
  await onboardStore.disconnect();
  await onboardStore.openModal();
};
</script>

<style lang="scss" scoped>
.login-view {
  @apply sm:pb-20;

  .login-btn {
    @apply mt-5 block w-full rounded-lg bg-white p-1 text-left text-gray-secondary outline-none transition-shadow disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none;
    &:hover:not(:disabled),
    &:focus:not(:disabled) {
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
