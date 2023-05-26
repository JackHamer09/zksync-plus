<template>
  <div class="login-view isolate">
    <div class="pointer-events-none absolute left-0 top-0 h-full w-full">
      <div class="relative h-full w-full overflow-hidden">
        <div class="bg-block-1 absolute inset-x-0 top-[-10rem] -z-10 overflow-hidden blur-3xl sm:top-[-20rem]">
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
          class="bg-block-2 absolute inset-x-0 top-[calc(100%-22rem)] -z-10 overflow-hidden blur-3xl sm:top-[calc(100%-43rem)]"
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
      </div>
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

    <footer class="login-footer">
      <div></div>
      <div class="made-with-love">
        Made with ❤️ by
        <a class="link" href="https://github.com/JackHamer09" target="_blank" rel="noopener">JackHamer</a>
        and
        <a
          class="link"
          href="https://github.com/JackHamer09/zksync-plus/graphs/contributors"
          target="_blank"
          rel="noopener"
        >
          contributors
        </a>
      </div>
      <a
        href="https://github.com/JackHamer09/zksync-plus"
        title="zkSync Plus GitHub page"
        target="_blank"
        rel="noopener"
        class="block w-max text-gray-500 hover:text-gray-900"
      >
        <svg class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </a>
    </footer>
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
  .login-footer {
    @apply absolute left-0 bottom-0 grid w-full items-center justify-items-center gap-3 px-6 pb-5 sm:grid-cols-[1.75rem_1fr_1.75rem];
    @media screen and (max-height: 480px) {
      @apply static mt-8 px-0;
    }

    .made-with-love {
      @apply whitespace-pre-line text-center text-sm text-gray-400;
    }
  }

  .bg-block-1 {
    animation: rotate-bg-1 100s linear 0s infinite;
  }
  .bg-block-2 {
    animation: rotate-bg-2 100s linear 0s infinite;
  }

  @keyframes rotate-bg-1 {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg) translateY(-60%) translateX(50%);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes rotate-bg-2 {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg) translateY(-80%) translateX(-80%);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
