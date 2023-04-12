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

    <TransactionConfirmTransactionModal v-model:opened="transactionConfirmModalOpened" :key="walletAddress">
      <template v-if="isAccountActivated === false">
        <CommonCardWithLineButtons>
          <AddressCard as="div" name="Account activation" :address="walletAddress!">
            <template #icon>
              <CheckBadgeIcon class="text-gray-secondary" aria-hidden="true" />
            </template>
            <template #address-icon>
              <img
                v-tooltip="`Activating your ${destinations.zkSyncLite.label} (L2) account`"
                :src="destinations.zkSyncLite.iconUrl"
                :alt="destinations.zkSyncLite.label"
              />
            </template>
          </AddressCard>
        </CommonCardWithLineButtons>
        <TransactionItemIcon :icon="PlusIcon" />
      </template>
      <CommonCardWithLineButtons>
        <AddressCard as="div" name="Your account" :address="walletAddress!">
          <template #icon>
            <UserIcon class="text-gray-secondary" aria-hidden="true" />
          </template>
          <template #address-icon>
            <img
              v-tooltip="`Sending from ${destinations.zkSyncLite.label} (L2)`"
              :src="destinations.zkSyncLite.iconUrl"
              :alt="destinations.zkSyncLite.label"
            />
          </template>
        </AddressCard>
        <TokenBalance
          v-if="selectedToken"
          v-bind="selectedToken"
          as="div"
          :amount="totalComputeAmount.toString()"
          :show-send-button="false"
        />
      </CommonCardWithLineButtons>
      <TransactionItemIcon :icon="ArrowDownIcon" />
      <CommonCardWithLineButtons>
        <AddressCard as="div" v-bind="selectedAddress">
          <template #address-icon>
            <img
              v-tooltip="`Sending to ${destinations.zkSyncLite.label} (L2)`"
              :src="destinations.zkSyncLite.iconUrl"
              :alt="destinations.zkSyncLite.label"
            />
          </template>
          <template #icon v-if="selectedAddress.icon">
            <component :is="selectedAddress.icon" class="text-gray-secondary" aria-hidden="true" />
          </template>
        </AddressCard>
      </CommonCardWithLineButtons>
      <TransactionFeeDetails class="mt-2" label="Fee:" :fee-token="feeToken" :fee-amount="fee" :loading="feeLoading" />

      <div class="mx-4 mt-3 mb-3.5 border-t border-dashed"></div>

      <TransactionFeeDetails
        v-for="(item, index) in totalOfEachToken"
        class="-my-0.5"
        :key="item.token.address"
        :label="index === 0 ? 'Total:' : ''"
        :fee-token="item.token"
        :fee-amount="item.amount"
      />

      <div class="sticky bottom-0 mt-auto w-full">
        <CommonButton
          class="mx-auto mt-6"
          :disabled="continueButtonDisabled"
          variant="primary-solid"
          @click="makeTransaction"
        >
          Confirm transaction
        </CommonButton>
      </div>
    </TransactionConfirmTransactionModal>

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
            v-tooltip="`Sending to ${destinations.zkSyncLite.label} (L2)`"
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
          :update-duration="60000"
          @update="estimate"
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
        <CommonButton :disabled="continueButtonDisabled" variant="primary-solid" @click="openConfirmationModal">
          Continue
        </CommonButton>
      </template>
    </ZksyncLiteTransactionFooter>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";
import { PencilIcon } from "@heroicons/vue/24/solid";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { storeToRefs } from "pinia";
import { closestPackableTransactionAmount } from "zksync";

import ZksyncLiteTransactionFooter from "@/components/transaction/zksync/lite/TransactionFooter.vue";

import useFee from "@/composables/zksync/lite/useFee";
import useTransaction from "@/composables/zksync/lite/useTransaction";

import type { FeeEstimationParams } from "@/composables/zksync/lite/useFee";
import type { TransactionParams } from "@/composables/zksync/lite/useTransaction";
import type { ZkSyncLiteToken } from "@/store/zksync/lite/tokens";
import type { BigNumberish } from "ethers";
import type { Component } from "vue";

import { useRoute } from "#app";
import { useContactsStore } from "@/store/contacts";
import { useDestinationsStore } from "@/store/destinations";
import { usePreferencesStore } from "@/store/preferences";
import { useLiteAccountActivationStore } from "@/store/zksync/lite/accountActivation";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { checksumAddress, decimalToBigNumber, formatRawTokenPrice, shortenAddress } from "@/utils/formatters";
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
const { commitTransaction } = useTransaction(() => walletLiteStore.getWalletInstance(true));
const { destinations } = storeToRefs(useDestinationsStore());
const { tokens } = storeToRefs(liteTokensStore);
const { walletAddress, balance, balanceInProgress, allBalancePricesLoaded, balanceError } =
  storeToRefs(walletLiteStore);
const { isAccountActivated, accountActivationCheckInProgress } = storeToRefs(liteAccountActivationStore);
const { userContacts } = storeToRefs(useContactsStore());
const { lastTransactionAddress } = storeToRefs(usePreferencesStore());

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
const estimate = async () => {
  if (
    !walletAddress.value ||
    !selectedToken.value ||
    !feeToken.value ||
    accountActivationCheckInProgress.value ||
    isAccountActivated.value === undefined ||
    transactionConfirmModalOpened.value
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

const amount = ref("");
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
    return closestPackableTransactionAmount(BigNumber.from(selectedToken.value.amount).sub(fee.value)).toString();
  }
  return closestPackableTransactionAmount(selectedToken.value.amount).toString();
});
const totalComputeAmount = computed(() => {
  try {
    if (!amount.value || !selectedToken.value) {
      return BigNumber.from("0");
    }
    return decimalToBigNumber(amount.value, selectedToken.value.decimals);
  } catch (error) {
    return BigNumber.from("0");
  }
});

const continueButtonDisabled = computed(() => !enoughBalanceToCoverFee.value || totalComputeAmount.value.eq(0));

const selectedAddress = computed<{ name: string; address: string; icon?: Component }>(() => {
  if (props.address === walletAddress.value) {
    return {
      name: "Your account",
      address: props.address,
      icon: UserIcon,
    };
  }

  const foundContact = userContacts.value.find((e) => e.address === props.address);
  if (foundContact) {
    return foundContact;
  }

  if (lastTransactionAddress.value === props.address) {
    return {
      name: "Last transaction",
      address: props.address,
      icon: ClockIcon,
    };
  }

  return {
    name: "",
    address: props.address,
  };
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

const transactionConfirmModalOpened = ref(false);
watch(walletAddress, () => {
  transactionConfirmModalOpened.value = false;
});
const openConfirmationModal = () => {
  if (continueButtonDisabled.value) {
    return;
  }
  transactionConfirmModalOpened.value = true;
};

const totalOfEachToken = computed<{ token: ZkSyncLiteToken; amount: BigNumberish }[]>(() => {
  if (!tokens.value) {
    return [];
  }

  const totalByAddress: { [symbol: string]: BigNumberish } = {};
  const addToTotal = (tokenAddress: string, amount: BigNumberish) => {
    if (totalByAddress[tokenAddress]) {
      totalByAddress[tokenAddress] = BigNumber.from(totalByAddress[tokenAddress]).add(amount);
    } else {
      totalByAddress[tokenAddress] = amount;
    }
  };

  if (selectedToken.value) {
    addToTotal(selectedToken.value.address, totalComputeAmount.value);
  }
  if (feeToken.value && fee.value) {
    addToTotal(feeToken.value.address, fee.value);
  }

  const tokensByAddress = Object.entries(tokens.value!).reduce((acc, [, token]) => {
    acc[token.address] = token;
    return acc;
  }, {} as { [address: string]: ZkSyncLiteToken });
  return Object.entries(totalByAddress)
    .filter(([tokenAddress]) => tokensByAddress[tokenAddress])
    .map(([tokenAddress, amount]) => {
      return {
        token: tokensByAddress[tokenAddress],
        amount: amount.toString(),
      };
    });
});

const makeTransaction = async () => {
  const transactions: TransactionParams[] = [
    { type: "Transfer", symbol: selectedToken.value!.symbol, to: props.address, amount: totalComputeAmount.value },
  ];
  await commitTransaction(
    transactions,
    feeToken.value!.symbol,
    fee.value!,
    isAccountActivated.value === false
      ? await liteAccountActivationStore.getAccountActivationTransaction(feeToken.value!.id)
      : undefined
  ).catch(() => undefined);
};
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
