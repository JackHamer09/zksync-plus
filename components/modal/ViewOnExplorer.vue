<template>
  <CommonModal v-bind="$attrs" title="View on explorer">
    <TypographyCategoryLabel>Recommended</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.era"
        as="a"
        :icon="ArrowUpRightIcon"
        :href="`${eraBlockExplorerUrl}/address/${account.address}`"
        target="_blank"
      />
    </CommonCardWithLineButtons>

    <TypographyCategoryLabel>Other networks</TypographyCategoryLabel>
    <CommonCardWithLineButtons>
      <DestinationItem
        v-bind="destinations.zkSyncLite"
        as="a"
        :icon="ArrowUpRightIcon"
        :href="`${liteBlockExplorerUrl}/address/${account.address}`"
        target="_blank"
      />
      <DestinationItem
        v-bind="destinations.ethereum"
        as="a"
        :icon="ArrowUpRightIcon"
        :href="`${ethereumBlockExplorerUrl}/address/${account.address}`"
        target="_blank"
      />
    </CommonCardWithLineButtons>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";

const { account, blockExplorerUrl: ethereumBlockExplorerUrl } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { blockExplorerUrl: eraBlockExplorerUrl } = storeToRefs(useEraProviderStore());
const { blockExplorerUrl: liteBlockExplorerUrl } = storeToRefs(useLiteProviderStore());
</script>
