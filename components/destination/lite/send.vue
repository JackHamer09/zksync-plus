<template>
  <CommonCardWithLineButtons>
    <DestinationItem
      v-bind="destinations.zkSyncLite"
      description="Send inside zkSync Lite (L2) network"
      @click="emit('selected', destinations.zkSyncLite)"
    />
    <DestinationItem
      v-bind="destinations.ethereum"
      description="Withdraw to Ethereum (L1)"
      @click="emit('selected', destinations.ethereum)"
    />
  </CommonCardWithLineButtons>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import type { TransactionDestination } from "@/store/destinations";

import { useDestinationsStore } from "@/store/destinations";

const { destinations } = storeToRefs(useDestinationsStore());

const emit = defineEmits<{
  (eventName: "selected", destination: TransactionDestination): void;
}>();
</script>
