<template>
  <SelectDestination v-if="step === 'destination'" @back="back()">
    <DestinationLiteSend v-if="from === 'lite'" @selected="destination = $event" />
    <DestinationLiteSend v-else-if="from === 'era'" @selected="destination = $event" />
  </SelectDestination>
  <SelectAddress
    v-else-if="step === 'address'"
    :own-address-displayed="ownAddressDisplayed"
    @selected="address = $event"
    @back="back()"
  />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import type { TransactionDestination } from "@/store/destinations";

import { useRoute, useRouter } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { usePreferencesStore } from "@/store/preferences";
import { checksumAddress } from "@/utils/formatters";
import SelectAddress from "@/views/SelectAddress.vue";
import SelectDestination from "@/views/SelectDestination.vue";

const router = useRouter();
const route = useRoute();
const { version } = storeToRefs(usePreferencesStore());
const { destinations } = storeToRefs(useDestinationsStore());

const getFrom = () => {
  if (route.query.from === "lite" || route.query.from === "era") {
    return route.query.from;
  }
  return version.value;
};
const getRouteDestination = () => {
  if (typeof route.query.destination === "string" && route.query.destination in destinations.value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const foundDestination = (destinations.value as any)[route.query.destination] as TransactionDestination;
    if (foundDestination.key) {
      return foundDestination;
    }
  }
  return null;
};
const getRouteAddress = () => {
  if (typeof route.query.address !== "string" || !isAddress(route.query.address)) {
    return null;
  }
  return checksumAddress(route.query.address);
};

const from = ref(getFrom());
const destination = ref<TransactionDestination | null>(getRouteDestination());
const address = ref<string | null>(getRouteAddress());

const step = computed<"destination" | "address" | "transaction-form">(() => {
  if (!destination.value) {
    return "destination";
  }
  if (!address.value) {
    return "address";
  }
  return "transaction-form";
});

const back = () => {
  if (step.value === "transaction-form" && !getRouteAddress()) {
    return (address.value = null);
  } else if (step.value === "address" && !getRouteDestination()) {
    return (destination.value = null);
  }
  router.push({ name: "index" });
};

const ownAddressDisplayed = computed(() => {
  if (destination.value?.key === "ethereum") {
    return true;
  }
  return false;
});
</script>

<style lang="scss" scoped></style>
