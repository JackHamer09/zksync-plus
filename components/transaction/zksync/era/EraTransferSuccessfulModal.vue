<template>
  <CommonModal v-bind="$attrs" :closable="false" class="transaction-successful-modal" title="">
    <template #animation>
      <Vue3Lottie v-if="inProgress" class="w-72" :animation-data="ProgressPlane" loop />
      <Vue3Lottie v-else class="w-72" :animation-data="SuccessConfetti" :loop="false" />
    </template>

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">
        {{ inProgress ? "Transaction submitted" : "Transaction completed" }}
      </div>
      <CommonCardWithLineButtons>
        <EraTransactionLineItem :transaction="transaction" />
      </CommonCardWithLineButtons>

      <CommonAlert v-if="inProgress" class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>
          Your funds will be available at the
          <a
            :href="`${blockExplorerUrl}/address/${transaction.to}`"
            target="_blank"
            class="font-medium underline underline-offset-2"
            >destination address</a
          >
          after the transaction is committed on the <span class="font-medium">{{ destinations.era.label }}</span
          >. You are free to close this page.
        </p>
        <a :href="`${blockExplorerUrl}/tx/${transaction.transactionHash}`" target="_blank" class="alert-link">
          Track status
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>
      <CommonAlert v-else class="mt-3" variant="success" :icon="InformationCircleIcon">
        <p>
          Your funds should now be available at the
          <a
            :href="`${blockExplorerUrl}/address/${transaction.to}`"
            target="_blank"
            class="font-medium underline underline-offset-2"
            >destination address</a
          >.
        </p>
      </CommonAlert>

      <div class="sticky bottom-0 z-[1] mt-auto flex w-full flex-col items-center">
        <NuxtLink :to="{ name: 'transaction-zksync-era' }" class="link mb-2 mt-8 text-sm underline-offset-2">
          Make another transaction
        </NuxtLink>
        <CommonButton as="RouterLink" :to="{ name: 'index' }" class="mx-auto" variant="primary-solid">
          Go to Home page
        </CommonButton>
      </div>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import EraTransactionLineItem from "@/components/transaction/zksync/era/EraTransactionLineItem.vue";

import ProgressPlane from "@/assets/lottie/progress-plane.json";
import SuccessConfetti from "@/assets/lottie/success-confetti.json";

import type { EraTransaction } from "@/utils/zksync/era/mappers";
import type { PropType } from "vue";

import { useDestinationsStore } from "@/store/destinations";
import { useEraProviderStore } from "@/store/zksync/era/provider";

defineProps({
  transaction: {
    type: Object as PropType<EraTransaction>,
    required: true,
  },
  inProgress: {
    type: Boolean,
    default: true,
  },
});

const { destinations } = storeToRefs(useDestinationsStore());
const { blockExplorerUrl } = storeToRefs(useEraProviderStore());
</script>

<style lang="scss">
.transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
