<template>
  <div>
    <CommonContentBlock>
      <CommonTotalBalance
        :balance="balance"
        :loading="balanceInProgress || !allBalancePricesLoaded"
        :error="balanceError"
      />
      <CommonButtonsLineGroup class="my-4">
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-lite-add-funds' }">
          <template #icon>
            <PlusIcon aria-hidden="true" />
          </template>
          <template #default>Add funds</template>
        </CommonButton>
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-lite' }">
          <template #icon>
            <PaperAirplaneIcon aria-hidden="true" />
          </template>
          <template #default>Send</template>
        </CommonButton>
      </CommonButtonsLineGroup>

      <!-- Tokens container -->
      <div>
        <div class="flex items-center justify-between py-4">
          <h2 class="text-sm text-gray-secondary">Balances</h2>
          <CommonLabelButton as="RouterLink" :to="{ name: 'balances' }">View all</CommonLabelButton>
        </div>
        <div class="-mx-3 -mt-1 -mb-3">
          <template v-if="balanceInProgress || !allBalancePricesLoaded">
            <TokenBalanceLoader v-for="index in 2" :key="index" />
          </template>
          <div v-else-if="balanceError" class="m-3 mb-2.5 -mt-1">
            <CommonErrorBlock @try-again="fetch">
              {{ balanceError.message }}
            </CommonErrorBlock>
          </div>
          <template v-else-if="displayedBalances.length">
            <TokenBalance v-for="item in displayedBalances" as="div" :key="item.address" v-bind="item" />
          </template>
          <template v-else>
            <CommonEmptyBlock class="mx-3 mb-3 mt-1">
              You don't have any balances on <span class="font-medium">{{ destinations.zkSyncLite.label }}</span> (L2)
              <br />
              <span class="mt-1.5 inline-block">
                Proceed to
                <NuxtLink class="link" :to="{ name: 'transaction-zksync-lite-add-funds' }">Add funds</NuxtLink> page to
                add balance to your account
              </span>
            </CommonEmptyBlock>
          </template>
        </div>
      </div>
    </CommonContentBlock>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount } from "vue";

import { PaperAirplaneIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useOnboardStore } from "@/store/onboard";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { parseTokenAmount, removeSmallAmount } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";

const onboardStore = useOnboardStore();
const walletLiteStore = useLiteWalletStore();
const { balance, balanceInProgress, balanceError, allBalancePricesLoaded } = storeToRefs(walletLiteStore);
const { destinations } = storeToRefs(useDestinationsStore());

const fetch = () => {
  walletLiteStore.requestBalance();
};
fetch();

const displayedBalances = computed(() => {
  return balance.value.filter(({ amount, decimals, price }) => {
    const decimalAmount =
      typeof price === "number" ? removeSmallAmount(amount, decimals, price) : parseTokenAmount(amount, decimals);
    if (!isOnlyZeroes(decimalAmount)) {
      return true;
    }
    return false;
  });
});

const unsubscribe = onboardStore.subscribeOnAccountChange((newAddress) => {
  if (!newAddress) return;
  fetch();
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>

<style lang="scss" scoped></style>
