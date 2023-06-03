<template>
  <div>
    <BackButton as="RouterLink" :fallback="{ name: 'transaction-zksync-era-receive' }" />

    <h1 class="h1">Receive</h1>
    <Receive :address="address">
      <CommonAlert variant="neutral">
        <p>
          Please transfer funds to this address using
          <span class="font-medium">{{ destinations.era.label }}</span> to successfully receive them
        </p>
      </CommonAlert>
    </Receive>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import Receive from "@/views/transaction/Receive.vue";

const { account } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());

const address = computed(() => account.value.address || "");
</script>
