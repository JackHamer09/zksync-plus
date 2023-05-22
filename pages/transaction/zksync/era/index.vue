<template>
  <SelectDestination @back="back()">
    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.era"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-send', query: $route.query }"
        :description="`Send inside zkSync Era∎ (L2) network`"
      />
      <DestinationItem
        v-bind="destinations.ethereum"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-withdraw', query: $route.query }"
        description="Withdraw to Ethereum (L1)"
      />
    </CommonCardWithLineButtons>
  </SelectDestination>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useRouter } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import SelectDestination from "@/views/SelectDestination.vue";

const { destinations } = storeToRefs(useDestinationsStore());

const router = useRouter();

const back = () => {
  router.push({ name: "index" });
};
</script>

<style lang="scss" scoped></style>
