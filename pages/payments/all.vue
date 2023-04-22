<template>
  <div>
    <CommonBackButton as="RouterLink" :to="{ name: 'payments' }" />
    <h1 class="h1">All payments</h1>
    <CommonBadgeTabs class="mb-4" />

    <div v-if="recentTransactionsRequestInProgress">
      <TypographyCategoryLabel>
        <CommonContentLoader :length="22" />
      </TypographyCategoryLabel>
      <CommonCardWithLineButtons>
        <TokenBalanceLoader v-for="index in 5" :key="index" />
      </CommonCardWithLineButtons>
    </div>
    <CommonCardWithLineButtons v-else-if="recentTransactionsRequestError">
      <CommonErrorBlock class="m-2" @try-again="fetch">
        {{ recentTransactionsRequestError!.message }}
      </CommonErrorBlock>
    </CommonCardWithLineButtons>
    <div v-else-if="transactions.length">
      <div v-for="(group, index) in transactionsGroups" :key="index">
        <TypographyCategoryLabel>
          {{ group.title }}
        </TypographyCategoryLabel>
        <TransactionsGroupedByBatch :transactions="group.transactions" />
      </div>

      <!-- Load more -->
      <template v-if="canLoadMore">
        <div v-if="previousTransactionsRequestInProgress">
          <TypographyCategoryLabel>
            <CommonContentLoader :length="22" />
          </TypographyCategoryLabel>
          <CommonCardWithLineButtons>
            <TokenBalanceLoader v-for="index in 5" :key="index" />
          </CommonCardWithLineButtons>
        </div>
        <CommonCardWithLineButtons v-else-if="previousTransactionsRequestError">
          <CommonErrorBlock class="m-2" @try-again="fetch">
            {{ previousTransactionsRequestError!.message }}
          </CommonErrorBlock>
        </CommonCardWithLineButtons>
        <CommonButton v-else ref="loadMoreEl" class="mx-auto mt-4">Load more</CommonButton>
      </template>
    </div>
    <CommonCardWithLineButtons v-else>
      <CommonEmptyBlock>
        At the moment you don't have any transactions on
        <span class="font-medium">{{ destinations.zkSyncLite.label }}</span> (L2)
      </CommonEmptyBlock>
    </CommonCardWithLineButtons>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from "vue";

import { useIntersectionObserver } from "@vueuse/core";
import { storeToRefs } from "pinia";

import TransactionsGroupedByBatch from "@/components/transaction/zksync/lite/TransactionsGroupedByBatch.vue";

import { useDestinationsStore } from "@/store/destinations";
import { useLiteTransactionsHistoryStore } from "@/store/zksync/lite/transactionsHistory";
import { groupTransactionsByDate } from "@/utils/mappers";

const liteTransactionsHistoryStore = useLiteTransactionsHistoryStore();
const {
  transactions,
  recentTransactionsRequestInProgress,
  recentTransactionsRequestError,
  canLoadMore,
  previousTransactionsRequestInProgress,
  previousTransactionsRequestError,
} = storeToRefs(liteTransactionsHistoryStore);
const { destinations } = storeToRefs(useDestinationsStore());

const transactionsGroups = groupTransactionsByDate(transactions);

const fetch = () => {
  liteTransactionsHistoryStore.requestRecentTransactions();
};
fetch();

const unsubscribe = liteTransactionsHistoryStore.subscribeOnAccountChange(() => {
  fetch();
});

const loadMoreEl = ref(null);
const { stop: stopLoadMoreObserver } = useIntersectionObserver(loadMoreEl, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    liteTransactionsHistoryStore.requestPreviousTransactions();
  }
});

onBeforeUnmount(() => {
  unsubscribe();
  stopLoadMoreObserver();
});
</script>

<style lang="scss" scoped></style>
