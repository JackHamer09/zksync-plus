<template>
  <div>
    <ModalTransactionDonateBinance v-model:opened="donateBinanceModalOpened" />
    <ModalTransactionDonateEthereum v-model:opened="donateEthereumModalOpened" />

    <CommonBackButton as="RouterLink" :to="{ name: 'index' }" />
    <h1 class="h1">Donate ❤️</h1>

    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.era"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-send', query: $route.query }"
        :description="`Donate on zkSync Era∎`"
      />
      <DestinationItem
        v-bind="destinations.zkSyncLite"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-withdraw', query: $route.query }"
        description="Donate on zkSync Lite"
      />
      <DestinationItem
        v-bind="destinations.ethereum"
        description="Donate on Ethereum"
        @click="donateEthereumModalOpened = true"
      />
    </CommonCardWithLineButtons>

    <TypographyCategoryLabel>Other platforms</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.binance"
        description="Donate on Binance"
        @click="donateBinanceModalOpened = true"
      />
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";

const { destinations } = storeToRefs(useDestinationsStore());

const donateEthereumModalOpened = ref(false);
const donateBinanceModalOpened = ref(false);
</script>

<style lang="scss" scoped></style>
