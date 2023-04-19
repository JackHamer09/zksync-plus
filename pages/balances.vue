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
    <template v-else>
      <div v-for="(group, index) in balanceGroups" :key="index" class="category">
        <TypographyCategoryLabel v-if="group.title" class="group-category-label">
          {{ group.title }}
        </TypographyCategoryLabel>
        <CommonCardWithLineButtons>
          <TokenBalance v-for="item in group.balances" as="div" :key="item.address" v-bind="item" />
        </CommonCardWithLineButtons>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { groupBalancesByAmount } from "@/utils/mappers";

const walletLiteStore = useLiteWalletStore();
const { balance, balanceInProgress, balanceError, allBalancePricesLoaded } = storeToRefs(walletLiteStore);

const fetch = () => {
  walletLiteStore.requestBalance();
};
fetch();

const balanceGroups = groupBalancesByAmount(balance);
</script>

<style lang="scss" scoped>
.category:first-child .group-category-label {
  @apply pt-0;
}
</style>
