<template>
  <div>
    <CommonBackButton as="RouterLink" :to="{ name: 'index' }" />
    <h1 class="h1">Swap tokens</h1>

    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.zigzag"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://trade.zigzag.exchange/?network=zksync"
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
