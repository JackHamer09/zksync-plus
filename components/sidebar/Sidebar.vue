<template>
  <nav class="navbar-container">
    <ModalNetworkChange v-model:opened="networkChangeModalOpened" />
    <ModalSupport v-model:opened="supportModalOpened" />

    <nav class="navbar-inner">
      <SidebarAccountButton />
      <div class="navbar-links-container">
        <NuxtLink :to="{ name: 'index' }" class="navbar-link">
          <HomeIcon class="navbar-link-icon" aria-hidden="true" />
          <span class="navbar-link-label">Home</span>
        </NuxtLink>
        <NuxtLink :to="{ name: 'payments' }" class="navbar-link">
          <ArrowsRightLeftIcon class="navbar-link-icon" aria-hidden="true" />
          <span class="navbar-link-label">Payments</span>
        </NuxtLink>
        <NuxtLink :to="{ name: 'contacts' }" class="navbar-link">
          <UserGroupIcon class="navbar-link-icon" aria-hidden="true" />
          <span class="navbar-link-label">Contacts</span>
        </NuxtLink>
      </div>
      <div class="navbar-bottom">
        <button
          v-tooltip="'Change network'"
          class="navbar-link navbar-bottom-button network-switch"
          @click="networkChangeModalOpened = true"
        >
          <img class="navbar-link-icon" src="/img/ethereum.svg" alt="Selected Ethereum network" />
          <span class="navbar-link-label">{{ selectedEthereumNetwork.name }}</span>
          <ChevronDownIcon class="dropdown-icon" aria-hidden="true" />
        </button>
        <button class="navbar-link navbar-bottom-button support-button" @click="supportModalOpened = true">
          <HeartIcon class="navbar-link-icon" aria-hidden="true" />
          <span class="navbar-link-label">Support</span>
        </button>
      </div>
    </nav>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { ArrowsRightLeftIcon, ChevronDownIcon, HeartIcon, HomeIcon, UserGroupIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useNetworkStore } from "@/store/network";

const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

const networkChangeModalOpened = ref(false);
const supportModalOpened = ref(false);
</script>

<style lang="scss" scoped>
.navbar-container {
  @apply sticky bottom-0 top-auto z-[3];
  grid-area: menu / menu / menu / menu;

  @media screen and (min-width: 720px) {
    @apply top-0 bottom-auto max-h-screen px-4 py-8; /* pointer-events-auto */
  }
  @media screen and (min-width: 1024px) {
    @apply px-6;
  }

  .navbar-inner {
    @apply grid h-full min-w-[3.5rem] grid-cols-[max-content_1fr] grid-rows-[repeat(2,_max-content)_1fr] bg-white md:max-w-[3.5rem] md:grid-cols-1 md:bg-transparent xl:max-w-[12.5rem]; /* hidden md:block */

    .navbar-links-container {
      @apply flex justify-around space-y-1 pr-3 md:mt-6 md:flex-col md:pr-0;
    }
    .navbar-link {
      @apply flex items-center rounded-xl bg-transparent text-gray-secondary no-underline transition-colors md:w-full md:py-3 md:px-4 md:hover:bg-gray-200/60;
      &.router-link-exact-active {
        @apply bg-white text-primary-400;
      }

      .navbar-link-icon {
        @apply h-6 w-6 text-inherit;
      }
      .navbar-link-label {
        @apply mr-auto ml-4 hidden text-left font-medium leading-4 tracking-[-0.1px] xl:block;
      }
    }
    .navbar-bottom {
      @apply mt-auto hidden space-y-2 md:block;

      .navbar-bottom-button {
        @apply border bg-gray-100 hover:border-gray-300;

        .navbar-link-label {
          @apply text-sm;
        }
      }
      .support-button {
        @apply py-2;
        .navbar-link-icon {
          @apply text-pink-600/70;
        }
      }
      .network-switch {
        .navbar-link-icon {
          @apply scale-150 xl:scale-125;
        }
        .dropdown-icon {
          @apply hidden h-4 w-4 text-inherit xl:block;
        }
      }
    }
  }
}
</style>
