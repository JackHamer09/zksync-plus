<template>
  <div>
    <CommonBackButton as="RouterLink" :to="{ name: 'contacts' }" />
    <h1 class="h1">Select network</h1>

    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.era"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-send', query: $route.query }"
        :description="`Send on zkSync Era∎`"
      />
    </CommonCardWithLineButtons>
    <CommonCardWithLineButtons class="mt-1">
      <DestinationItem
        v-bind="destinations.zkSyncLite"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-withdraw', query: $route.query }"
        description="Send on zkSync Lite"
      />
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";

const { destinations } = storeToRefs(useDestinationsStore());
</script>

<style lang="scss" scoped></style>
