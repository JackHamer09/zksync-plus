<template>
  <SelectAddress
    v-if="step === 'address'"
    :destination="destinations.ethereum"
    :destination-tooltip="`Withdraw to ${destinations.ethereum.label} (L1)`"
    own-address-displayed
    @selected="address = $event"
    @back="back()"
  />
  <LiteTransferForm v-else-if="step === 'transaction-form'" type="Withdraw" :address="address!" @back="back()" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import { useRoute, useRouter } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { checksumAddress } from "@/utils/formatters";
import SelectAddress from "@/views/SelectAddress.vue";
import LiteTransferForm from "@/views/zksync/lite/transactions/Transfer.vue";

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
  router.push({ name: "transaction-zksync-lite", query: route.query });
};
</script>

<style lang="scss" scoped></style>
