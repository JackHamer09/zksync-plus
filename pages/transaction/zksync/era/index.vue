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

    <TypographyCategoryLabel>Send to exchange</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        label="Official bridge"
        :icon-url="destinations.ethereum.iconUrl"
        as="RouterLink"
        :to="{ name: 'transaction-zksync-era-withdraw', query: $route.query }"
        description="Send to exchange using official bridge"
        disabled
      />
      <DestinationItem
        v-bind="destinations.layerswap"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://www.layerswap.io/?sourceExchangeName=ZKSYNCERA_MAINNET"
      />
    </CommonCardWithLineButtons>

    <TypographyCategoryLabel>Send to another network</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.layerswap"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://www.layerswap.io/?sourceExchangeName=ZKSYNCERA_MAINNET"
      />
      <DestinationItem
        v-bind="destinations.orbiter"
        :icon="ArrowUpRightIcon"
        as="a"
        target="_blank"
        href="https://www.orbiter.finance/?source=zkSync%20Era"
      />
    </CommonCardWithLineButtons>
  </SelectDestination>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
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
