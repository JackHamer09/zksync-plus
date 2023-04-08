<template>
  <div class="flex h-full flex-col">
    <TokenSelectDropdown
      v-model:opened="selectFeeTokenModalOpened"
      v-model:token-address="selectedFeeTokenAddress"
      title="Choose fee token"
      :loading="balancesLoading"
      :balances="tokensAvailableForFee"
    >
      <template #body-bottom>
        <CommonAlert class="mt-3" variant="neutral" :icon="InformationCircleIcon">
          <p>Only tokens available for paying fees are displayed</p>
          <a href="https://docs.zksync.io/userdocs/tokens/#how-fees-are-paid" target="_blank" class="alert-link">
            Learn more
            <ArrowUpRightIcon class="ml-1 h-3 w-3" />
          </a>
        </CommonAlert>
      </template>
    </TokenSelectDropdown>

    <CommonBackButton @click="emit('back')" />
    <div class="transaction-header">
      <div class="transaction-header-info">
        <h1 class="transaction-header-title h1">Send to</h1>
        <div class="transaction-header-address hidden xs:block" :title="props.address">{{ props.address }}</div>
        <div class="transaction-header-address xs:hidden" :title="props.address">
          {{ shortenAddress(props.address, 5) }}
        </div>
      </div>
      <AddressAvatar class="transaction-header-avatar" :address="props.address">
        <template #icon>
          <img
            v-tooltip="`Sending to ${destinations.zkSyncLite.label}`"
            :src="destinations.zkSyncLite.iconUrl"
            :alt="destinations.zkSyncLite.label"
          />
        </template>
      </AddressAvatar>
    </div>

    <CommonErrorBlock v-if="balanceError" @try-again="fetchBalances">
      {{ balanceError.message }}
    </CommonErrorBlock>
    <form v-else class="transaction-form pb-2">
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
      <transition v-bind="TransitionOpacity()">
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
      <transition v-bind="TransitionAlertScaleInOutTransition">
        <CommonAlert v-if="!enoughBalanceToCoverFee" class="mt-1" variant="error" :icon="ExclamationTriangleIcon">
          <p>
            Insufficient <span class="font-medium">{{ feeToken?.symbol }}</span> balance to cover the fee
          </p>
          <button type="button" class="alert-link" @click="openFeeTokenModal">Change fee token</button>
        </CommonAlert>
      </transition>
      <transition v-bind="TransitionAlertScaleInOutTransition">
        <CommonAlert v-if="isAccountActivated === false" class="mt-1" variant="info" :icon="InformationCircleIcon">
          <p>
            This is your first transaction on
            <span class="font-medium">{{ destinations.zkSyncLite.label }}</span> network, which means your account
            requires <span class="font-medium">one-time</span> account activation. Transaction
            <span class="font-medium">fee</span> will be <span class="font-medium">higher than usual</span>
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

    <ZksyncLiteTransactionFooter>
      <template #after-checks>
        <CommonButton disabled variant="primary-solid">Continue</CommonButton>
      </template>
    </ZksyncLiteTransactionFooter>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { ArrowUpRightIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import { PencilIcon } from "@heroicons/vue/24/solid";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";

import ZksyncLiteTransactionFooter from "@/components/transaction/zksync/lite/TransactionFooter.vue";

import useFee from "@/composables/zksync/lite/useFee";

import type { FeeEstimationParams } from "@/composables/zksync/lite/useFee";

import { useRoute } from "#app";
import { useDestinationsStore } from "@/store/destinations";
import { useLiteAccountActivationStore } from "@/store/zksync/lite/accountActivation";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { checksumAddress, formatRawTokenPrice, shortenAddress } from "@/utils/formatters";
import { TransitionAlertScaleInOutTransition, TransitionOpacity } from "@/utils/transitions";

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

const liteProviderStore = useLiteProviderStore();
const walletLiteStore = useLiteWalletStore();
const liteAccountActivationStore = useLiteAccountActivationStore();
const liteTokensStore = useLiteTokensStore();
const { destinations } = storeToRefs(useDestinationsStore());
const { tokens } = storeToRefs(liteTokensStore);
const { walletAddress, balance, balanceInProgress, allBalancePricesLoaded, balanceError } =
  storeToRefs(walletLiteStore);
const { isAccountActivated, accountActivationCheckInProgress } = storeToRefs(liteAccountActivationStore);

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

const selectFeeTokenModalOpened = ref(false);
const selectedFeeTokenAddress = ref<string | undefined>();
const feeTokenAddress = computed(() => selectedFeeTokenAddress.value ?? selectedTokenAddress.value);
const {
  result: fee,
  inProgress: feeInProgress,
  error: feeError,
  estimateFee,

  tokensAvailableForFee,
  feeToken,
  enoughBalanceToCoverFee,
} = useFee(liteProviderStore.requestProvider, tokens, feeTokenAddress, balance);
const feeLoading = computed(
  () =>
    feeInProgress.value ||
    (!fee.value && balancesLoading.value) ||
    (accountActivationCheckInProgress.value && isAccountActivated.value === undefined)
);
watch(
  () => feeToken.value?.symbol,
  (symbol) => {
    if (!symbol) return;
    liteTokensStore.requestTokenPrice(symbol);
  }
);
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
  if (feeToken.value?.address === selectedToken.value.address) {
    if (!fee.value) {
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
  if (
    !walletAddress.value ||
    !selectedToken.value ||
    !feeToken.value ||
    accountActivationCheckInProgress.value ||
    isAccountActivated.value === undefined
  ) {
    return;
  }
  const fees: FeeEstimationParams[] = [{ type: "Transfer", symbol: selectedToken.value.symbol, to: props.address }];
  if (isAccountActivated.value === false) {
    fees.push({
      type: {
        ChangePubKey: { onchainPubkeyAuth: false },
      },
      symbol: selectedToken.value.symbol,
      to: walletAddress.value,
    });
  }
  estimateFee(fees, walletAddress.value, feeToken.value.symbol);
};
watch(
  [
    () => props.address,
    () => selectedToken.value?.symbol,
    () => feeToken.value?.symbol,
    walletAddress,
    isAccountActivated,
  ],
  () => {
    estimate();
  },
  { immediate: true }
);

const fetchBalances = () => {
  walletLiteStore.requestBalance().then(() => {
    if (allBalancePricesLoaded.value && !selectedToken.value) {
      selectedTokenAddress.value = tokenWithHighestBalancePrice.value?.address;
    }
  });
};
fetchBalances();

liteAccountActivationStore.checkAccountActivation();
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
</style>
