<template>
  <button class="account-button" @click="onboardStore.disconnect">
    <AddressAvatar :address="account.address!" class="account-icon" />
    <span class="account-name">{{ shortenAddress(account.address!) }}</span>
  </button>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";
import { shortenAddress } from "@/utils/formatters";

const onboardStore = useOnboardStore();
const { account } = storeToRefs(onboardStore);
</script>

<style lang="scss" scoped>
.account-button {
  @apply flex w-full items-center rounded-xl bg-transparent py-3 px-3 no-underline transition-colors hover:bg-gray-200 xl:px-4;
  .account-icon {
    @apply h-8 w-8;
  }
  .account-name {
    @apply mr-auto ml-3 hidden font-medium leading-4 tracking-[-0.1px] xl:block;
  }
}
</style>
