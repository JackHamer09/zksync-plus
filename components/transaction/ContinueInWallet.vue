<template>
  <CommonHeightTransition :opened="opened">
    <div class="text-center text-sm font-medium text-gray-500">
      <div class="pt-1"></div>
      Continue in your {{ walletName }} wallet
    </div>
  </CommonHeightTransition>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";

defineProps({
  opened: {
    type: Boolean,
    required: true,
  },
});

const { walletName } = storeToRefs(useOnboardStore());
</script>
