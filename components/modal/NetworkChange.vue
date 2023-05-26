<template>
  <CommonModal v-bind="$attrs" title="Change network" @close="closeModal">
    <CommonCardWithLineButtons>
      <DestinationItem
        v-for="item in chains"
        :key="item.network"
        :as="isNetworkSelected(item.network) ? 'button' : 'a'"
        :label="item.name"
        :href="getNetworkUrl(item, route.path)"
        :icon="isNetworkSelected(item.network) ? CheckIcon : undefined"
        :icon-url="item.iconUrl"
        @click="buttonClicked(item.network)"
      >
        <template #image v-if="!item.iconUrl">
          <div
            class="flex h-full w-full items-center justify-center rounded-full border bg-white text-lg font-medium text-gray-secondary"
          >
            {{ getFirstLetter(item.name) }}
          </div>
        </template>
      </DestinationItem>
    </CommonCardWithLineButtons>
  </CommonModal>
</template>

<script lang="ts" setup>
import { CheckIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useRoute } from "#app";
import { chains, useNetworkStore } from "@/store/network";
import { getNetworkUrl } from "@/utils/helpers";

const emit = defineEmits<{
  (eventName: "update:opened", state: boolean): void;
}>();

const route = useRoute();

const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());
const isNetworkSelected = (network: string) => selectedEthereumNetwork.value.network === network;
const buttonClicked = (network: string) => {
  if (isNetworkSelected(network)) {
    closeModal();
  }
};
const closeModal = () => emit("update:opened", false);
const getFirstLetter = (name: string) => name.slice(0, 1).toUpperCase();
</script>
