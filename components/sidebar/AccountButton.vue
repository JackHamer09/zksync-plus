<template>
  <Menu as="div" class="account-button-container">
    <MenuButton as="template">
      <SidebarAccountAvatarName hide-name-on-mobile class="main-account-button" />
    </MenuButton>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0"
      enter-to-class="transform opacity-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100"
      leave-to-class="transform opacity-0"
    >
      <MenuItems
        class="absolute left-0 top-0 z-10 w-56 rounded-lg bg-white pb-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
      >
        <MenuButton as="template">
          <SidebarAccountAvatarName title="Click to close popup" />
        </MenuButton>

        <div class="mb-1.5 border-t"></div>

        <MenuItem v-slot="{ active }">
          <button class="account-menu-item" :class="{ active }" @click="onboardStore.disconnect">
            <PowerIcon aria-hidden="true" />
            Logout
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { PowerIcon } from "@heroicons/vue/24/solid";

import { useOnboardStore } from "@/store/onboard";

const onboardStore = useOnboardStore();
</script>

<style lang="scss" scoped>
.account-button-container {
  @apply relative;

  .main-account-button {
    @apply transition-colors hover:bg-gray-200;
  }
  .account-menu-item {
    @apply grid w-full grid-cols-[max-content_1fr] items-center gap-3 px-3 py-2 text-left leading-6 text-gray-900 transition-colors xl:px-4;
    &.active {
      @apply bg-gray-50 text-primary-400;

      svg {
        @apply bg-white text-primary-400;
      }
    }

    svg {
      @apply h-auto w-8 rounded-full bg-gray-50 p-2 text-gray-500;
    }
  }
}
</style>
