<template>
  <SelectAddress
    v-if="step === 'address'"
    title="Where to add funds"
    :destination="destinations.era"
    :destination-tooltip="`Add funds to ${destinations.era.label} (L2)`"
    own-address-displayed
    @selected="address = $event"
    @back="back()"
  />
  <EraDepositForm v-else-if="step === 'transaction-form'" :address="address!" @back="back()" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import { useRoute, useRouter } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { checksumAddress } from "@/utils/formatters";
import SelectAddress from "@/views/SelectAddress.vue";
import EraDepositForm from "@/views/zksync/era/transactions/Deposit.vue";

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
  router.push({ name: "transaction-zksync-era-add-funds" });
};
</script>

<style lang="scss" scoped></style>
