<template>
  <div>
    <CommonBackButton as="RouterLink" :to="{ name: 'index' }" />
    <h1 class="h1">Add funds</h1>

    <CommonCardWithLineButtons>
      <DestinationItem
        label="Official bridge"
        :icon-url="destinations.ethereum.iconUrl"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-deposit', query: $route.query }"
        description="Add funds using official bridge"
      />
    </CommonCardWithLineButtons>

    <TypographyCategoryLabel>Top-up from another network</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.layerswap"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://www.layerswap.io/?destNetwork=ZKSYNCERA_MAINNET"
      />
      <DestinationItem
        v-bind="destinations.orbiter"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://www.orbiter.finance/?dest=zkSync%20Era"
      />
    </CommonCardWithLineButtons>

    <TypographyCategoryLabel>Top-up with cash</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.ramp"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://ramp.network/buy/"
      />
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";

const { destinations } = storeToRefs(useDestinationsStore());
</script>

<style lang="scss" scoped></style>
