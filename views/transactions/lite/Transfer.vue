<template>
  <div class="flex h-full flex-col">
    <CommonBackButton @click="emit('back')" />
    <div class="transaction-header">
      <div class="transaction-header-info">
        <h1 class="transaction-header-title h1">Send to</h1>
        <div class="transaction-header-address hidden xs:block" :title="props.address">{{ props.address }}</div>
        <div class="transaction-header-address xs:hidden" :title="props.address">
          {{ shortenAddress(props.address, 5) }}
        </div>
      </div>
      <AddressAvatar class="transaction-header-avatar" :address="props.address" />
    </div>

    <CommonErrorBlock v-if="balanceError" @try-again="fetch">
      {{ balanceError.message }}
    </CommonErrorBlock>
    <form v-else class="transaction-form">
      <CommonAmountInput
        v-model.trim="amount"
        v-model:token-address="selectedTokenAddress"
        :balances="balance"
        :maxAmount="maxAmount"
        :loading="balanceInProgress"
        autofocus
      />
      <CommonErrorBlock v-if="feeError" class="mt-2" @try-again="estimate">
        Fee estimation error: {{ feeError.message }}
      </CommonErrorBlock>
      <transition
        enter-active-class="transition ease-in duration-200"
        enter-from-class="transform opacity-0"
        enter-to-class="transform opacity-100"
        leave-active-class="transition ease-in duration-50"
        leave-from-class="transform opacity-100"
        leave-to-class="transform opacity-0"
      >
        <TransactionFeeDetails
          v-if="fee || feeInProgress"
          label="Fee:"
          :fee-token="feeToken"
          :fee-amount="fee"
          :loading="feeInProgress"
        />
      </transition>
    </form>

    <div class="transaction-footer">
      <CommonButton disabled variant="primary-solid">
        Continue
        <!-- Send to {{ destinations.zkSyncLite.label }} -->
      </CommonButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { BigNumber } from "ethers";
import { storeToRefs } from "pinia";

import useFee from "@/composables/zksync/lite/useFee";

/* import { useDestinationsStore } from "@/store/destinations"; */
import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { shortenAddress } from "@/utils/formatters";

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "back"): void;
}>();

/* const { destinations } = storeToRefs(useDestinationsStore()); */
const liteProviderStore = useLiteProviderStore();
const walletLiteStore = useLiteWalletStore();
const { tokens } = storeToRefs(useLiteTokensStore());
const { account } = storeToRefs(useOnboardStore());
const { balance, balanceInProgress, balanceError } = storeToRefs(walletLiteStore);
const {
  result: fee,
  inProgress: feeInProgress,
  error: feeError,
  estimateFee,
} = useFee(liteProviderStore.requestProvider);

const amount = ref("");

const selectedTokenAddress = ref(balance.value[0]?.address);
const selectedToken = computed(() => {
  if (!balance.value) {
    return undefined;
  }
  return balance.value.find((e) => e.address === selectedTokenAddress.value);
});

const selectedFeeTokenAddress = ref<string | undefined>();
const feeTokenAddress = computed(() => selectedFeeTokenAddress.value ?? selectedTokenAddress.value);
const feeToken = computed(() => {
  if (!feeTokenAddress.value || !tokens.value) {
    return;
  }
  return Object.entries(tokens.value).find(([, token]) => token.address === feeTokenAddress.value)?.[1];
});

const maxAmount = computed(() => {
  if (!selectedToken.value) {
    return undefined;
  }
  if (feeTokenAddress.value === selectedToken.value.address) {
    if (!feeToken.value || !fee.value) {
      return undefined;
    }
    if (BigNumber.from(fee.value).gt(selectedToken.value.amount)) {
      return "0";
    }
    return BigNumber.from(selectedToken.value.amount).sub(fee.value).toString();
  }
  return selectedToken.value.amount;
});

const estimate = async () => {
  if (!account.value.address || !feeToken.value) {
    return;
  }
  estimateFee([{ type: "Transfer", symbol: "ETH", to: props.address }], account.value.address, feeToken.value.symbol);
};
watch(
  [() => props.address, () => feeToken.value?.symbol, () => account.value.address],
  () => {
    estimate();
  },
  { immediate: true }
);

const fetch = () => {
  walletLiteStore.requestBalance().then(() => {
    if (!selectedToken.value) {
      selectedTokenAddress.value = balance.value[0]?.address;
    }
  });
};
fetch();
</script>

<style lang="scss" scoped>
.transaction-header {
  @apply flex items-center justify-between pb-6;

  .transaction-header-info {
    .transaction-header-title {
      @apply pb-1;
    }
    .transaction-header-address {
      @apply text-sm font-semibold text-primary-400;
    }
  }
  .transaction-header-avatar {
    @apply mt-5 h-14 w-14;
  }
}
.transaction-footer {
  @apply sticky bottom-6 z-[2] mt-auto flex flex-col items-center pt-6;
}
</style>
