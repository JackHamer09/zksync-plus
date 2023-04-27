<template>
  <div>
    <h1 class="h1">Payments</h1>
    <CommonBadgeTabs class="mb-4" />

    <CommonContentBlock>
      <CommonButtonsLineGroup class="mb-4">
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-lite' }">
          <template #icon>
            <PaperAirplaneIcon aria-hidden="true" />
          </template>
          <template #default>Send</template>
        </CommonButton>
      </CommonButtonsLineGroup>
      <div class="transactions-block-container">
        <div class="flex items-center justify-between py-4">
          <h2 class="text-sm text-gray-secondary">Transactions</h2>
          <CommonLabelButton as="RouterLink" :to="{ name: 'payments-all' }">View all</CommonLabelButton>
        </div>
        <div class="transactions-container">
          <template v-if="recentTransactionsRequestInProgress">
            <TokenBalanceLoader v-for="index in 5" :key="index" />
          </template>
          <div v-else-if="recentTransactionsRequestError" class="m-3 mb-2.5 -mt-1">
            <CommonErrorBlock @try-again="fetch">
              {{ recentTransactionsRequestError.message }}
            </CommonErrorBlock>
          </div>
          <template v-else-if="transactions.length">
            <ZkSyncLiteTransactionLineItem
              v-for="(item, index) in transactions.slice(0, 5)"
              :key="index"
              :transaction="item"
              display-date
            />
          </template>
          <template v-else>
            <CommonEmptyBlock class="mx-3 mb-3 mt-1">
              You currently don't have any transactions on
              <span class="font-medium">{{ destinations.zkSyncLite.label }}</span> (L2)
              <!-- <br />
              <span class="mt-1.5 inline-block">
                If you are looking for your deposit transaction then you should find it
              </span> -->
            </CommonEmptyBlock>
          </template>
        </div>
      </div>
    </CommonContentBlock>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";

import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import ZkSyncLiteTransactionLineItem from "@/components/transaction/zksync/lite/ZkSyncLiteTransactionLineItem.vue";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useLiteTransactionsHistoryStore } from "@/store/zksync/lite/transactionsHistory";

const onboardStore = useOnboardStore();
const liteTransactionsHistoryStore = useLiteTransactionsHistoryStore();
const { transactions, recentTransactionsRequestInProgress, recentTransactionsRequestError } =
  storeToRefs(liteTransactionsHistoryStore);
const { destinations } = storeToRefs(useDestinationsStore());

const fetch = () => {
  liteTransactionsHistoryStore.requestRecentTransactions();
};
fetch();

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  fetch();
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>

<style lang="scss" scoped></style>

<style lang="scss" scoped>
.transactions-block-container {
  .transactions-container {
    @apply -mx-3 -mt-1 -mb-3;
  }
}
</style>
