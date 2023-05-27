<template>
  <div>
    <CommonCardWithLineButtons v-if="balanceInProgress || !allBalancePricesLoaded">
      <TokenBalanceLoader v-for="index in 2" :key="index" send-route-name />
    </CommonCardWithLineButtons>
    <CommonCardWithLineButtons v-else-if="balanceError">
      <CommonErrorBlock @try-again="fetch">
        {{ balanceError.message }}
      </CommonErrorBlock>
    </CommonCardWithLineButtons>
    <div v-else>
      <div v-for="(group, index) in balanceGroups" :key="index">
        <TypographyCategoryLabel v-if="group.title">
          {{ group.title }}
        </TypographyCategoryLabel>
        <CommonCardWithLineButtons>
          <TokenBalance
            v-for="item in group.balances"
            as="div"
            :key="item.address"
            send-route-name="transaction-zksync-lite"
            v-bind="item"
          />
        </CommonCardWithLineButtons>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";

import { storeToRefs } from "pinia";

import type { ZkSyncLiteTokenAmount } from "@/types";

import { useOnboardStore } from "@/store/onboard";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { groupBalancesByAmount } from "@/utils/mappers";

const onboardStore = useOnboardStore();
const walletLiteStore = useLiteWalletStore();
const { balance, balanceInProgress, balanceError, allBalancePricesLoaded } = storeToRefs(walletLiteStore);

const balanceGroups = groupBalancesByAmount<ZkSyncLiteTokenAmount>(balance);

const fetch = () => {
  walletLiteStore.requestBalance();
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
