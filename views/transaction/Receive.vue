<template>
  <div>
    <h1 class="h1">Receive</h1>

    <div>
      <div class="qr-code-container">
        <QrCode
          class="qr-code"
          :value="account.address"
          :options="{ margin: 0, width: '100%', style: { padding: '0px' } }"
        />
      </div>
      <p class="mt-1.5 text-center text-sm text-gray-secondary">Scan to copy address</p>
    </div>
    <div class="mx-auto mt-4 max-w-sm space-y-2">
      <CommonInfoContent label="Address" :copy-content="address">
        {{ shortenAddress(address, 5) }}
      </CommonInfoContent>
      <CommonAlert variant="neutral">
        <p>
          Please transfer funds to this address using
          <span class="font-medium">{{ destination.label }}</span> to successfully receive them
        </p>
      </CommonAlert>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { storeToRefs } from "pinia";

import type { TransactionDestination } from "@/store/destinations";
import type { PropType } from "vue";

import { useOnboardStore } from "@/store/onboard";

defineProps({
  destination: {
    type: Object as PropType<TransactionDestination>,
    required: true,
  },
});

const { account } = storeToRefs(useOnboardStore());

const address = computed(() => account.value.address || "");
</script>

<style lang="scss">
.qr-code-container {
  @apply mx-auto aspect-square h-48 w-48 rounded-xl bg-white p-3 shadow-sm;

  .qr-code {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
