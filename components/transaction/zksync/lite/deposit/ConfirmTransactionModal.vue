<template>
  <CommonModal
    v-if="status !== 'done'"
    v-bind="$attrs"
    :close-on-background-click="status === 'not-started'"
    class="confirm-deposit-transaction-modal"
    :title="`Confirm transaction`"
  >
    <div class="flex h-full flex-col overflow-auto">
      <template v-if="transaction">
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="account.address!"
            :destination="destinations.ethereum"
            :tooltip="`Add funds from ${destinations.ethereum.label} (L1)`"
          />
          <div class="-mx-1 border-b border-dashed"></div>
          <TokenBalance v-bind="transaction.token" as="div" :amount="transaction.amount" :show-send-button="false" />
        </CommonCardWithLineButtons>
        <TransactionItemIcon :icon="ArrowDownIcon" />
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="transaction.to"
            :destination="destinations.zkSyncLite"
            :tooltip="`Add funds to ${destinations.zkSyncLite.label} (L2)`"
          />
        </CommonCardWithLineButtons>
      </template>

      <TransactionFeeDetails class="my-2" label="Fee:" :fee-token="feeToken" :fee-amount="fee" />

      <div class="sticky bottom-0 z-[1] mt-auto w-full bg-gray bg-opacity-60 backdrop-blur-sm">
        <div class="mx-4 mb-3 border-t border-dashed border-gray-300"></div>
        <TransactionFeeDetails
          v-for="(item, index) in totalOfEachToken"
          class="-my-0.5"
          :key="item.token.address"
          :label="index === 0 ? 'Total:' : ''"
          :fee-token="item.token"
          :fee-amount="item.amount"
        />
        <transition v-bind="TransitionAlertScaleInOutTransition">
          <div v-if="!buttonDisabled && newFeeAlert" class="mx-4 mt-3">
            <CommonAlert variant="warning" :icon="ExclamationCircleIcon">
              <p>Fee has changed since you started the transaction. Please confirm the updated fee to proceed.</p>
              <CommonButton @click="newFeeAlert = false">Confirm</CommonButton>
            </CommonAlert>
          </div>
        </transition>
        <div v-if="error" class="mx-4">
          <CommonErrorBlock :retry-button="false" class="mt-3">
            {{ error.message }}
          </CommonErrorBlock>
        </div>
        <CommonButton
          :disabled="buttonDisabled || newFeeAlert || status !== 'not-started'"
          class="mx-auto mt-3"
          variant="primary-solid"
          @click="makeTransaction"
        >
          <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
            <span v-if="status === 'processing'">Processing...</span>
            <span v-else-if="status === 'waiting-for-signature'">Waiting for confirmation</span>
            <span v-else>Add funds to {{ destinations.zkSyncLite.label }}</span>
          </transition>
        </CommonButton>
        <transition v-bind="TransitionHeight()">
          <div v-if="status === 'waiting-for-signature'" class="h-6 text-center text-sm font-medium text-gray-500">
            <div class="pt-1"></div>
            Confirm this transaction in your {{ walletName }} wallet
          </div>
        </transition>
      </div>
    </div>
  </CommonModal>

  <CommonModal v-else v-bind="$attrs" :closable="false" class="deposit-transaction-successful-modal" title="">
    <template #animation>
      <Vue3Lottie v-if="!transactionCommitted" class="w-72" :animation-data="ProgressPlane" loop />
      <Vue3Lottie v-else class="w-72" :animation-data="SuccessConfetti" :loop="false" />
    </template>

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">
        {{ transactionCommitted ? "Transaction completed" : "Transaction submitted" }}
      </div>
      <CommonCardWithLineButtons v-if="transaction">
        <TransactionLineItem
          :icon="transactionReceiptIcon"
          :transaction-url="`${blockExplorerUrl}/tx/${transactionReceipt?.hash}`"
        >
          <template #top-left>
            <div class="transaction-line-label">Deposit</div>
          </template>
          <template #top-right>
            <TokenAmount
              :token="transaction.token"
              :amount="transaction.amount"
              :direction="transactionReceiptDirection"
            />
          </template>
          <template #bottom-right>
            <TotalPrice
              :token="transaction.token"
              :amount="transaction.amount"
              :direction="transactionReceiptDirection"
              :loading="transaction.token.price === 'loading'"
            />
          </template>
        </TransactionLineItem>
      </CommonCardWithLineButtons>

      <CommonAlert v-if="!transactionCommitted" class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>
          Your funds will be available on <span class="font-medium">{{ destinations.zkSyncLite.label }}</span> after the
          transaction is committed on <span class="font-medium">{{ destinations.ethereum.label }}</span
          >. You are free to close this page.
        </p>
        <a :href="`${blockExplorerUrl}/tx/${ethTransactionHash}`" target="_blank" class="alert-link">
          Track status
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>
      <CommonAlert v-else class="mt-3" variant="success" :icon="InformationCircleIcon">
        <p>
          Your funds should now be available on <span class="font-medium">{{ destinations.zkSyncLite.label }}</span>
        </p>
      </CommonAlert>

      <div class="sticky bottom-0 z-[1] mt-auto flex w-full flex-col items-center">
        <CommonButton as="RouterLink" :to="{ name: 'index' }" class="mx-auto mt-8" variant="primary-solid">
          Go to Home page
        </CommonButton>
      </div>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { Vue3Lottie } from "vue3-lottie";

import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { storeToRefs } from "pinia";

import TokenAmount from "@/components/transaction/transactionLineItem/TokenAmount.vue";
import TotalPrice from "@/components/transaction/transactionLineItem/TotalPrice.vue";

import useTransaction from "@/composables/zksync/lite/deposit/useTransaction";

import ProgressPlane from "@/assets/lottie/progress-plane.json";
import SuccessConfetti from "@/assets/lottie/success-confetti.json";

import type { Token } from "@/types";
import type { BigNumberish, ContractTransaction } from "ethers";
import type { PropType } from "vue";

import { useDestinationsStore } from "@/store/destinations";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { usePreferencesStore } from "@/store/preferences";
import { useLiteEthereumBalanceStore } from "@/store/zksync/lite/ethereumBalance";
import { useLiteTransactionsHistoryStore } from "@/store/zksync/lite/transactionsHistory";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { calculateFee } from "@/utils/helpers";
import { TransitionHeight, TransitionPrimaryButtonText } from "@/utils/transitions";

export type ConfirmationModalTransaction = {
  to: string;
  token: Token;
  amount: BigNumberish;
};

const props = defineProps({
  transaction: {
    type: Object as PropType<ConfirmationModalTransaction>,
  },
  feeToken: {
    type: Object as PropType<Token>,
  },
  fee: {
    type: Object as PropType<{
      gasLimit: BigNumberish;
      gasPrice: BigNumberish;
    }>,
  },
  buttonDisabled: {
    type: Boolean,
    default: false,
  },
  estimate: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },
});

const liteTransactionsHistoryStore = useLiteTransactionsHistoryStore();
const walletLiteStore = useLiteWalletStore();
const liteEthereumBalanceStore = useLiteEthereumBalanceStore();
const { account, walletName } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { blockExplorerUrl } = storeToRefs(useNetworkStore());
const { previousTransactionAddress } = storeToRefs(usePreferencesStore());
const { status, error, ethTransactionHash, commitTransaction } = useTransaction(() =>
  walletLiteStore.getWalletInstance()
);

const fee = computed(() => {
  if (!props.fee) return undefined;
  return calculateFee(props.fee.gasLimit, props.fee.gasPrice).toString();
});
const lastFee = ref(fee.value);
watch(fee, (newFee) => {
  if (newFee) {
    lastFee.value = newFee;
  }
});

const newFeeAlert = ref(false);

const totalOfEachToken = computed<{ token: Token; amount: BigNumberish }[]>(() => {
  const tokenBySymbol: { [symbol: string]: Token } = {};
  if (props.transaction) {
    tokenBySymbol[props.transaction.token.symbol] = props.transaction.token;
  }
  if (props.feeToken) {
    tokenBySymbol[props.feeToken.symbol] = props.feeToken;
  }

  const totalBySymbol: { [symbol: string]: BigNumberish } = {};
  const addToTotal = (tokenSymbol: string, amount: BigNumberish) => {
    if (totalBySymbol[tokenSymbol]) {
      totalBySymbol[tokenSymbol] = BigNumber.from(totalBySymbol[tokenSymbol]).add(amount);
    } else {
      totalBySymbol[tokenSymbol] = amount;
    }
  };

  if (props.transaction) {
    addToTotal(props.transaction.token.symbol, props.transaction.amount);
  }
  if (props.feeToken && lastFee.value) {
    addToTotal(props.feeToken.symbol, lastFee.value);
  }

  return Object.entries(totalBySymbol).map(([symbol, amount]) => ({
    token: tokenBySymbol[symbol],
    amount: amount.toString(),
  }));
});

const transactionReceipt = ref<ContractTransaction | undefined>();
const transactionCommitted = ref(false);
const transactionReceiptDirection = computed(() => {
  if (!props.transaction) return undefined;
  return props.transaction.to === account.value.address ? "in" : "out";
});
const transactionReceiptIcon = computed(() => {
  if (!transactionReceiptDirection.value) {
    return undefined;
  }
  return transactionReceiptDirection.value === "in" ? ArrowRightIcon : ArrowLeftIcon;
});

const makeTransaction = async () => {
  if (!props.feeToken || !fee.value) return;

  const prevFee = BigNumber.from(lastFee.value);

  await props.estimate();

  if (prevFee.lt(fee.value)) {
    newFeeAlert.value = true;
  }

  if (newFeeAlert.value || props.buttonDisabled) return;

  const tx = await commitTransaction(props.transaction!, props.fee!);

  if (status.value === "done") {
    previousTransactionAddress.value = props.transaction!.to;
  }

  if (tx) {
    transactionReceipt.value = tx?.ethTx;
    tx.awaitEthereumTxCommit().then(() => {
      transactionCommitted.value = true;
      liteTransactionsHistoryStore.reloadRecentTransactions();
      walletLiteStore.requestBalance({ force: true });
      liteEthereumBalanceStore.requestBalance({ force: true });
    });
  }
};
</script>

<style lang="scss">
.confirm-deposit-transaction-modal .modal-card {
  @apply grid h-full grid-rows-[max-content_1fr];
}
.deposit-transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
