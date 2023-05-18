<template>
  <SelectAddress
    v-if="step === 'address'"
    :destination="destinations.era"
    :destination-tooltip="`Send to ${destinations.era.label} (L2)`"
    @selected="address = $event"
    @back="back()"
  />
  <EraTransferForm v-else-if="step === 'transaction-form'" type="transfer" :address="address!" @back="back()" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import { useRoute, useRouter } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { checksumAddress } from "@/utils/formatters";
import SelectAddress from "@/views/SelectAddress.vue";
import EraTransferForm from "@/views/zksync/era/transactions/Transfer.vue";

const { destinations } = storeToRefs(useDestinationsStore());

const router = useRouter();
const route = useRoute();

const getRouteAddress = () => {
  if (typeof route.query.address !== "string" || !isAddress(route.query.address)) {
    return null;
  }
  return checksumAddress(route.query.address);
};

const address = ref<string | null>(getRouteAddress());

const step = computed<"address" | "transaction-form">(() => {
  if (!address.value) {
    return "address";
  }
  return "transaction-form";
});

const back = () => {
  if (step.value === "transaction-form" && !getRouteAddress()) {
    return (address.value = null);
  }
  router.push({ name: "transaction-zksync-era", query: route.query });
};
</script>

<style lang="scss" scoped></style>
