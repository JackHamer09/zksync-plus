<template>
  <SelectAddress
    v-if="step === 'address'"
    :destination="destinations.zkSyncLite"
    :destination-tooltip="`Send to ${destinations.zkSyncLite.label} (L2)`"
    @selected="address = $event"
    @back="back()"
  />
  <LiteTransferForm v-else-if="step === 'transaction-form'" :address="address!" @back="back()" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import { useRoute, useRouter } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { checksumAddress } from "@/utils/formatters";
import SelectAddress from "@/views/SelectAddress.vue";
import LiteTransferForm from "@/views/transactions/lite/Transfer.vue";

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
  router.push({ name: "transaction-zksync-lite" });
};
</script>

<style lang="scss" scoped></style>
