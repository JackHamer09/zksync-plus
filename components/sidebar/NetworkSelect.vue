<template>
  <Menu as="div" class="network-switch isolate" v-slot="{ open }">
    <MenuButton class="account-menu-item" :class="{ 'has-hover': !open }">
      <img
        v-if="selectedEthereumNetwork.iconUrl"
        :src="selectedEthereumNetwork.iconUrl"
        :alt="selectedEthereumNetwork.name"
        class="account-menu-item-icon p-1"
      />
      <div v-else class="account-menu-item-icon">{{ selectedEthereumNetwork.name.slice(0, 1) }}</div>
      <div class="flex items-center justify-between">
        <span>{{ selectedEthereumNetwork.name }}</span>
        <ChevronDownIcon
          class="mr-1 ml-2 h-4 w-4 transition-transform"
          :class="{ 'rotate-180': open }"
          aria-hidden="true"
        />
      </div>
    </MenuButton>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <MenuItems
        class="absolute left-0 top-0 z-[-1] w-full rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
      >
        <div class="mt-12 border-t"></div>
        <div class="px-1 py-0.5">
          <MenuItem v-for="item in chains" as="template" v-slot="{ active }" :key="item.name">
            <a
              :href="getNetworkUrl(item, route.path)"
              class="network-item"
              :class="{ selected: item.network === selectedEthereumNetwork.network, active }"
            >
              <div class="flex items-center">
                <img
                  v-if="item.iconUrl"
                  :src="item.iconUrl"
                  :alt="item.name"
                  class="account-menu-item-icon small p-0.5"
                />
                <div v-else class="account-menu-item-icon small">{{ item.name.slice(0, 1) }}</div>
                <div class="pl-2">{{ item.name }}</div>
              </div>
              <CheckIcon
                v-if="item.network === selectedEthereumNetwork.network"
                class="check-icon"
                aria-hidden="true"
              />
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useRoute } from "#app";
import { chains, useNetworkStore } from "@/store/network";
import { getNetworkUrl } from "@/utils/helpers";

const route = useRoute();

const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());
</script>

<style lang="scss" scoped>
.network-switch {
  @apply relative text-left;

  .network-item {
    @apply relative my-0.5 block cursor-pointer rounded-lg px-4 py-2 text-sm;
    &.active {
      &:not(.selected) {
        @apply bg-gray-100 text-gray-900;
      }
      &.selected {
        @apply bg-primary-100/70;
      }
    }
    &.selected {
      @apply bg-primary-100/50 text-primary-400;

      .account-menu-item-icon {
        @apply bg-primary-50;
      }
    }

    .check-icon {
      @apply absolute top-0 bottom-0 right-3 my-auto h-4 w-4;
    }
  }
}
</style>
