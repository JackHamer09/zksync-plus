<template>
  <div class="flex h-full flex-col">
    <TokenSelectDropdown
      v-model:opened="selectFeeTokenModalOpened"
      v-model:token-address="selectedFeeTokenAddress"
      :loading="balancesLoading"
      :balances="balance"
    />

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

    <CommonErrorBlock v-if="balanceError" @try-again="fetchBalances">
      {{ balanceError.message }}
    </CommonErrorBlock>
    <form v-else class="transaction-form">
      <CommonAmountInput
        v-model.trim="amount"
        v-model:token-address="selectedTokenAddress"
        :balances="balance"
        :maxAmount="maxAmount"
        :loading="balancesLoading"
        autofocus
      />
      <CommonErrorBlock v-if="feeError" class="mt-2" @try-again="estimate">
        Fee estimation error: {{ feeError.message }}
      </CommonErrorBlock>
      <transition
        enter-active-class="transition ease-in duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-50"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <TransactionFeeDetails
          v-if="fee || feeLoading"
          class="mt-1"
          label="Fee:"
          :fee-token="feeToken"
          :fee-amount="fee"
          :loading="feeLoading"
        >
          <button class="change-fee-token-button" type="button" title="Change fee token" @click="openFeeTokenModal">
            Change
            <span class="xs:hidden">&nbsp;fee token</span>
            <PencilIcon class="change-fee-token-icon" aria-hidden="true" />
          </button>
        </TransactionFeeDetails>
      </transition>
      <transition
        enter-active-class="transition ease-in duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-50"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <CommonAlert v-if="!enoughBalanceToCoverFee" class="mt-1" variant="error" :icon="ExclamationTriangleIcon">
          <p>
            Insufficient <span class="font-medium">{{ feeToken?.symbol }}</span> balance to cover the fee
          </p>
          <button type="button" class="alert-link" @click="openFeeTokenModal">Change fee token</button>
        </CommonAlert>
      </transition>
      <transition
        enter-active-class="transition ease-in duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-50"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <CommonAlert
          v-if="isAccountActivated === false && !accountActivationCheckInProgress"
          class="mt-1"
          variant="info"
          :icon="InformationCircleIcon"
        >
          <p>
            This is your first transaction on <span class="font-medium">zkSync Lite</span> network, which means your
            account requires <span class="font-medium">one-time</span> account activation. Transaction
            <span class="font-medium">fee</span> will be <span class="font-medium">higher than usual</span>.
          </p>
          <a
            href="https://docs.zksync.io/userdocs/faq/#what-is-the-account-activation-fee"
            target="_blank"
            class="alert-link"
          >
            Learn more
            <ArrowUpRightIcon class="ml-1 h-3 w-3" />
          </a>
        </CommonAlert>
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

import { ArrowUpRightIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { PencilIcon } from "@heroicons/vue/24/solid";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import useFee from "@/composables/zksync/lite/useFee";

/* import { useDestinationsStore } from "@/store/destinations"; */
import { useRoute } from "#app";
import { useOnboardStore } from "@/store/onboard";
import { useLiteAccountActivationStore } from "@/store/zksync/lite/accountActivation";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { checksumAddress, formatRawTokenPrice, shortenAddress } from "@/utils/formatters";

const props = defineProps({
  address: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "back"): void;
}>();

const route = useRoute();

/* const { destinations } = storeToRefs(useDestinationsStore()); */
const liteProviderStore = useLiteProviderStore();
const walletLiteStore = useLiteWalletStore();
const liteAccountActivationStore = useLiteAccountActivationStore();
const liteTokensStore = useLiteTokensStore();
const { tokens } = storeToRefs(liteTokensStore);
const { account } = storeToRefs(useOnboardStore());
const { balance, balanceInProgress, allBalancePricesLoaded, balanceError } = storeToRefs(walletLiteStore);
const { isAccountActivated, accountActivationCheckInProgress } = storeToRefs(liteAccountActivationStore);
const {
  result: fee,
  inProgress: feeInProgress,
  error: feeError,
  estimateFee,
} = useFee(liteProviderStore.requestProvider);

const amount = ref("");

const routeTokenAddress = computed(() => {
  if (!route.query.token || Array.isArray(route.query.token) || !isAddress(route.query.token)) {
    return;
  }
  return checksumAddress(route.query.token);
});
const tokenWithHighestBalancePrice = computed(() => {
  const tokenWithHighestBalancePrice = [...balance.value].sort((a, b) => {
    const aPrice = typeof a.price === "number" ? formatRawTokenPrice(a.amount, a.decimals, a.price) : 0;
    const bPrice = typeof b.price === "number" ? formatRawTokenPrice(b.amount, b.decimals, b.price) : 0;
    return bPrice - aPrice;
  });
  return tokenWithHighestBalancePrice[0] ? tokenWithHighestBalancePrice[0] : undefined;
});
const selectedTokenAddress = ref(routeTokenAddress.value ?? tokenWithHighestBalancePrice.value?.address);
const selectedToken = computed(() => {
  if (!balance.value) {
    return undefined;
  }
  return balance.value.find((e) => e.address === selectedTokenAddress.value);
});

const selectFeeTokenModalOpened = ref(false);
const selectedFeeTokenAddress = ref<string | undefined>();
const feeTokenAddress = computed(() => selectedFeeTokenAddress.value ?? selectedTokenAddress.value);
const feeToken = computed(() => {
  if (!feeTokenAddress.value || !tokens.value) {
    return;
  }
  const foundToken = Object.entries(tokens.value).find(([, token]) => token.address === feeTokenAddress.value)?.[1];
  if (!foundToken?.enabledForFees) {
    return tokens.value["ETH"];
  }
  return foundToken;
});
const feeLoading = computed(() => feeInProgress.value || (!fee.value && balancesLoading.value));
const openFeeTokenModal = () => {
  selectFeeTokenModalOpened.value = true;
};

const balancesLoading = computed(() => {
  return balanceInProgress.value || (!selectedToken.value && !allBalancePricesLoaded.value);
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

const enoughBalanceToCoverFee = computed(() => {
  if (!feeToken.value) {
    return true;
  }
  const feeTokenBalance = balance.value.find((e) => e.address === feeToken.value!.address);
  if (!feeTokenBalance) return true;
  if (fee.value && BigNumber.from(fee.value).gt(feeTokenBalance.amount)) {
    return false;
  }
  return true;
});

const estimate = async () => {
  if (!account.value.address || !selectedToken.value || !feeToken.value) {
    return;
  }
  estimateFee(
    [{ type: "Transfer", symbol: selectedToken.value.symbol, to: props.address }],
    account.value.address,
    feeToken.value.symbol
  );
};
watch(
  [() => props.address, () => selectedToken.value?.symbol, () => feeToken.value?.symbol, () => account.value.address],
  () => {
    estimate();
  },
  { immediate: true }
);
watch(
  () => feeToken.value?.symbol,
  (symbol) => {
    if (!symbol) return;
    liteTokensStore.requestTokenPrice(symbol);
  }
);
watch(
  () => selectedToken?.value?.symbol,
  (symbol) => {
    if (!symbol) return;
    liteTokensStore.requestTokenPrice(symbol);
  }
);
watch(allBalancePricesLoaded, (loaded) => {
  if (loaded && !selectedToken.value) {
    selectedTokenAddress.value = tokenWithHighestBalancePrice.value?.address;
  }
});

const fetchBalances = () => {
  walletLiteStore.requestBalance().then(() => {
    if (allBalancePricesLoaded.value && !selectedToken.value) {
      selectedTokenAddress.value = tokenWithHighestBalancePrice.value?.address;
    }
  });
};
fetchBalances();

liteAccountActivationStore.checkAccountActivation();
watch(
  () => account.value.address,
  () => {
    liteAccountActivationStore.reloadAccountActivation();
  }
);
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
.change-fee-token-button {
  @apply ml-2 mt-1 flex w-max cursor-pointer items-center rounded bg-primary-100/50 py-1 px-1.5 text-xs font-medium text-primary-400 transition-colors hover:bg-primary-100 xs:-mr-4 xs:mt-0;

  .change-fee-token-icon {
    @apply ml-1 h-3 w-3;
  }
}
.transaction-footer {
  @apply sticky bottom-6 z-[2] mt-auto flex flex-col items-center pt-6;
}
</style>
