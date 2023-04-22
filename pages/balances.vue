<template>
  <div>
    <CommonBackButton as="RouterLink" :to="{ name: 'index' }" />
    <h1 class="h1">Balances</h1>
    <CommonBadgeTabs class="mb-4" />

    <CommonCardWithLineButtons v-if="balanceInProgress || !allBalancePricesLoaded">
      <TokenBalanceLoader v-for="index in 2" :key="index" />
    </CommonCardWithLineButtons>
    <CommonCardWithLineButtons v-else-if="balanceError">
      <CommonErrorBlock class="m-2" @try-again="fetch">
        {{ balanceError!.message }}
      </CommonErrorBlock>
    </CommonCardWithLineButtons>
    <div v-else>
      <div v-for="(group, index) in balanceGroups" :key="index">
        <TypographyCategoryLabel v-if="group.title">
          {{ group.title }}
        </TypographyCategoryLabel>
        <CommonCardWithLineButtons>
          <TokenBalance v-for="item in group.balances" as="div" :key="item.address" v-bind="item" />
        </CommonCardWithLineButtons>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { groupBalancesByAmount } from "@/utils/mappers";

const walletLiteStore = useLiteWalletStore();
const { balance, balanceInProgress, balanceError, allBalancePricesLoaded } = storeToRefs(walletLiteStore);

const balanceGroups = groupBalancesByAmount(balance);

const fetch = () => {
  walletLiteStore.requestBalance();
};
fetch();
</script>

<style lang="scss" scoped></style>
