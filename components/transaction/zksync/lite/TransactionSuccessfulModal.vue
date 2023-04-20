<template>
  <CommonModal v-bind="$attrs" :closable="false" class="transaction-successful-modal" title="">
    <Vue3Lottie class="mx-auto -mt-14 -mb-16 w-72" :animation-data="SuccessConfetti" :loop="false" />

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">Transaction completed</div>
      <CommonCardWithLineButtons v-if="transactionsRequestInProgress">
        <TokenBalanceLoader v-for="index in transactionHashes.length" :key="index" />
      </CommonCardWithLineButtons>
      <CommonCardWithLineButtons v-else-if="transactionsRequestError">
        <CommonErrorBlock class="m-2" @try-again="fetch">
          {{ transactionsRequestError!.message }}
        </CommonErrorBlock>
      </CommonCardWithLineButtons>
      <template v-else>
        <CommonCardWithLineButtons>
          <ZkSyncLiteTransactionLineItem
            v-for="(item, index) in transactions"
            :key="index"
            :transaction="item"
            :wallet-address="walletAddress!"
          />
        </CommonCardWithLineButtons>
      </template>

      <slot name="after-transactions" />

      <div class="sticky bottom-0 z-[1] mt-auto flex w-full flex-col items-center">
        <NuxtLink :to="{ name: 'transaction-zksync-lite' }" class="link mb-2 mt-8 text-sm underline-offset-2">
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
import { watchEffect } from "vue";
import { Vue3Lottie } from "vue3-lottie";

import { storeToRefs } from "pinia";

import ZkSyncLiteTransactionLineItem from "@/components/transaction/zksync/lite/ZkSyncLiteTransactionLineItem.vue";

import useTransactions from "@/composables/zksync/lite/useTransactions";

import SuccessConfetti from "@/assets/lottie/success-confetti.json";

import type { PropType } from "vue";

import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";

const props = defineProps({
  transactionHashes: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const liteProviderStore = useLiteProviderStore();
const liteTokensStore = useLiteTokensStore();
const { tokens } = storeToRefs(liteTokensStore);
const { walletAddress } = storeToRefs(useLiteWalletStore());
const { transactions, transactionsRequestInProgress, transactionsRequestError, requestTransactions } = useTransactions(
  liteProviderStore.requestProvider,
  () => liteTokensStore.requestTokens().then(() => (tokens.value ? Object.values(tokens.value) : undefined))
);

const fetch = () => {
  requestTransactions(props.transactionHashes);
};

watchEffect(() => {
  fetch();
});
</script>

<style lang="scss">
.transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
