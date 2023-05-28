<template>
  <div>
    <CommonBackButton as="RouterLink" :to="{ name: 'transaction-zksync-lite-receive' }" />

    <Receive :destination="destinations.zkSyncLite" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import Receive from "@/views/transaction/Receive.vue";

const { destinations } = storeToRefs(useDestinationsStore());
</script>
