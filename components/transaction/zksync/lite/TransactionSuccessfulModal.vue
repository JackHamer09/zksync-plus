<template>
  <CommonModal v-bind="$attrs" class="transaction-successful-modal" title="">
    <Vue3Lottie class="mx-auto -mt-24 -mb-14 w-72" :animation-data="SuccessConfetti" :loop="false" />
    <div class="h2 text-center sm:h1">Transaction completed</div>

    <div class="flex h-full flex-col overflow-auto">
      <CommonCardWithLineButtons>
        <TransactionLineItem
          v-for="(item, index) in transactions"
          :key="index"
          v-bind="item"
          :wallet-address="walletAddress!"
        />
      </CommonCardWithLineButtons>

      <div class="sticky bottom-0 z-[1] mt-auto flex w-full flex-col items-center">
        <button class="link mb-2 mt-8 text-sm underline-offset-2">Make another transaction</button>
        <CommonButton class="mx-auto" variant="primary-solid">Go to Home page</CommonButton>
      </div>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { Vue3Lottie } from "vue3-lottie";

import { storeToRefs } from "pinia";

import SuccessConfetti from "@/assets/lottie/success-confetti.json";

import type { ConfirmationModalTransaction } from "./ConfirmTransactionModal.vue";
import type { PropType } from "vue";

import { useLiteWalletStore } from "@/store/zksync/lite/wallet";

defineProps({
  transactions: {
    type: Array as PropType<ConfirmationModalTransaction[]>,
    required: true,
  },
});

const { walletAddress } = storeToRefs(useLiteWalletStore());
</script>

<style lang="scss">
.confirm-transaction-modal .modal-card {
  @apply grid h-full grid-rows-[max-content_1fr];
}
</style>
