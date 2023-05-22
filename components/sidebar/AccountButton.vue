<template>
  <Popover as="div" class="account-button-container">
    <PopoverButton as="template">
      <SidebarAccountAvatarName hide-name-on-mobile class="main-account-button" />
    </PopoverButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0"
      enter-to-class="transform opacity-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100"
      leave-to-class="transform opacity-0"
    >
      <PopoverPanel class="popover-panel">
        <PopoverButton as="template">
          <SidebarAccountAvatarName class="popover-account-button" tabindex="-1" title="Click to close popup" />
        </PopoverButton>

        <div class="popover-options">
          <SidebarNetworkSelect />
          <button class="account-menu-item has-hover" @click="onboardStore.disconnect">
            <PowerIcon class="account-menu-item-icon p-2" aria-hidden="true" />
            Logout
          </button>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script lang="ts" setup>
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { PowerIcon } from "@heroicons/vue/24/solid";

import { useOnboardStore } from "@/store/onboard";

const onboardStore = useOnboardStore();
</script>

<style lang="scss">
.account-button-container {
  @apply relative;

  .main-account-button {
    @apply transition-colors hover:bg-gray-200;
  }
  .popover-panel {
    @apply absolute left-0 bottom-0 z-10 h-max w-56 rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5 focus:outline-none md:-left-px md:-top-px md:p-px;
    display: grid;
    grid-template-areas:
      "popover-options"
      "account-button";
    grid-template-rows: repeat(2, max-content);
    @media screen and (min-width: 720px) {
      grid-template-areas:
        "account-button"
        "popover-options";
    }

    .popover-account-button {
      grid-area: account-button;
    }
    .popover-options {
      @apply border-b p-1 md:border-b-0 md:border-t;
      grid-area: popover-options;
    }
  }
  .account-menu-item {
    @apply grid w-full grid-cols-[max-content_1fr] items-center gap-3 rounded-lg px-2 py-2 text-left leading-6 text-gray-900 transition-colors xl:px-4;
    &.has-hover:hover {
      @apply bg-gray-100 text-primary-400;

      .account-menu-item-icon {
        @apply bg-white text-primary-400;
      }
    }
  }
  .account-menu-item-icon {
    @apply flex aspect-square h-auto w-8 items-center justify-center rounded-full bg-gray-50 text-center text-gray-500;
    &.small {
      @apply w-6;
    }
  }
}
</style>
