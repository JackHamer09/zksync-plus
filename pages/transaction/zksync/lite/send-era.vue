<template>
  <div>
    <CommonBackButton as="RouterLink" :to="{ name: 'transaction-zksync-lite' }" />
    <h1 class="h1">Choose provider</h1>

    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.orbiter"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://www.orbiter.finance/?source=zkSync%20Lite&dest=zkSync%20Era"
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
