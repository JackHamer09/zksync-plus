<template>
  <component :is="as" class="account-button">
    <AddressAvatar v-if="!avatar" :address="account.address!" class="account-icon" />
    <img v-else :src="avatar" class="account-icon aspect-square rounded-full" />
    <span class="account-name" :class="{ 'hidden xl:block': hideNameOnMobile }">
      {{ name ? name : shortenAddress(account.address!) }}
    </span>
  </component>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import type { Component, PropType } from "vue";

import { useEnsStore } from "@/store/ens";
import { useOnboardStore } from "@/store/onboard";
import { shortenAddress } from "@/utils/formatters";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "button",
  },
  hideNameOnMobile: {
    type: Boolean,
    default: false,
  },
});

const { account } = storeToRefs(useOnboardStore());
const { name, avatar } = storeToRefs(useEnsStore());
</script>

<style lang="scss" scoped>
.account-button {
  @apply flex w-full items-center rounded-xl bg-transparent py-3 px-3 xl:px-4;
  .account-icon {
    @apply h-8 w-8;
  }
  .account-name {
    @apply mr-auto ml-3 font-medium leading-4 tracking-[-0.1px];
  }
}
</style>
