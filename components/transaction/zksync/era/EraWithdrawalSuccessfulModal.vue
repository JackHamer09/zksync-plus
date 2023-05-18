<template>
  <CommonModal v-bind="$attrs" :closable="false" class="transaction-successful-modal" title="">
    <template #animation>
      <Vue3Lottie class="w-72" :animation-data="ProgressPlane" loop />
    </template>

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">Transaction submitted</div>
      <CommonCardWithLineButtons>
        <EraTransactionLineItem :transaction="transaction" />
      </CommonCardWithLineButtons>

      <CommonAlert class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>
          Your funds will be available on the <span class="font-medium">{{ destinations.ethereum.label }}</span> after a
          <a
            href="https://era.zksync.io/docs/dev/troubleshooting/withdrawal-delay.html#withdrawal-delay"
            target="_blank"
            class="link"
            >~24-hour delay</a
          >. During this time, the transaction will be processed and finalized. You are free to close this page.
        </p>
        <a
          href="https://era.zksync.io/docs/dev/troubleshooting/withdrawal-delay.html#withdrawal-delay"
          target="_blank"
          class="alert-link"
        >
          Learn more
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
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
import { Vue3Lottie } from "vue3-lottie";

import { ArrowUpRightIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import EraTransactionLineItem from "@/components/transaction/zksync/era/EraTransactionLineItem.vue";

import ProgressPlane from "@/assets/lottie/progress-plane.json";

import type { EraTransaction } from "@/utils/zksync/era/mappers";
import type { PropType } from "nuxt/dist/app/compat/capi";

import { useDestinationsStore } from "@/store/destinations";

defineProps({
  transaction: {
    type: Object as PropType<EraTransaction>,
    required: true,
  },
});

const { destinations } = storeToRefs(useDestinationsStore());
</script>

<style lang="scss">
.transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
