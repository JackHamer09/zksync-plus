<template>
  <div class="login-header">
    <ModalNetworkChange v-model:opened="networkChangeModalOpened" />

    <img class="login-header-logo" src="/logo.svg" alt="zkSync Plus" />
    <button class="navbar-link navbar-bottom-button network-switch" @click="networkChangeModalOpened = true">
      <img class="navbar-link-icon" src="/img/ethereum.svg" alt="Selected Ethereum network" />
      <span class="navbar-link-label" data-testid="network-switcher">{{ selectedEthereumNetwork.name }}</span>
      <ChevronDownIcon class="dropdown-icon" aria-hidden="true" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useNetworkStore } from "@/store/network";

const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

const networkChangeModalOpened = ref(false);
</script>

<style lang="scss" scoped>
.login-header {
  @apply mx-4 my-7 flex items-center justify-between xs:mx-8;

  .login-header-logo {
    @apply block h-5 w-auto max-w-full;
  }
  .network-switch {
    @apply flex w-max items-center rounded-xl bg-transparent py-2 px-3.5 text-gray-secondary no-underline transition-colors hover:bg-gray-200/60 xs:py-2.5;
    @apply border bg-gray-100 hover:border-gray-300;
    &.router-link-exact-active {
      @apply bg-white text-primary-400;
    }

    .navbar-link-icon {
      @apply -ml-0.5 h-6 w-6 scale-150 text-inherit;
    }
    .dropdown-icon {
      @apply ml-3 -mr-0.5 hidden h-4 w-4 text-inherit xs:block;
    }
    .navbar-link-label {
      @apply mr-auto ml-2 text-left text-sm font-medium leading-4 tracking-[-0.1px] xs:ml-4;
    }
  }
}
</style>
