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
      <PopoverPanel
        class="absolute -left-px -top-px z-10 w-56 rounded-lg bg-white p-px shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
      >
        <PopoverButton as="template">
          <SidebarAccountAvatarName tabindex="-1" title="Click to close popup" />
        </PopoverButton>

        <div class="border-t"></div>

        <div class="p-1">
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
