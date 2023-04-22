<template>
  <CommonModal
    v-if="status !== 'done'"
    v-bind="$attrs"
    :close-on-background-click="status === 'not-started'"
    class="confirm-transaction-modal"
    :title="`Confirm transaction`"
  >
    <div class="flex h-full flex-col overflow-auto">
      <template v-if="accountActivation">
        <CommonCardWithLineButtons>
          <DestinationItem
            as="div"
            label="Account activation"
            :description="`${destinations.zkSyncLite.label} account activation`"
            :icon-url="destinations.zkSyncLite.iconUrl"
          />
        </CommonCardWithLineButtons>
        <TransactionItemIcon :icon="PlusIcon" />
      </template>

      <template v-for="(item, index) in computedTransactions" :key="index">
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="walletAddress!"
            :destination="destinations.zkSyncLite"
            :tooltip="`${getActionName(item.type)} from ${destinations.zkSyncLite.label} (L2)`"
          />
          <div class="-mx-1 border-b border-dashed"></div>
          <TokenBalance v-bind="item.token" as="div" :amount="item.amount" :show-send-button="false" />
        </CommonCardWithLineButtons>
        <TransactionItemIcon :icon="ArrowDownIcon" />
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="item.to"
            :destination="destination"
            :tooltip="`${getActionName(item.type)} to ${destination.label} (L2)`"
          />
        </CommonCardWithLineButtons>
        <TransactionItemIcon v-if="index !== computedTransactions.length - 1" :icon="PlusIcon" />
      </template>

      <TransactionFeeDetails class="my-2" label="Fee:" :fee-token="feeToken" :fee-amount="lastFee" />

      <div class="sticky bottom-0 z-[1] mt-auto w-full bg-gray bg-opacity-60 backdrop-blur-sm">
        <slot name="alerts" />
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
        <a
          v-if="destination.key === 'ethereum'"
          class="link mx-auto mt-2 -mb-1 flex items-center justify-center text-center text-sm"
          href="https://docs.zksync.io/userdocs/faq/#how-long-are-withdrawal-times"
          target="_blank"
        >
          Will arrive in 10 minutes to 7 hours
          <ArrowUpRightIcon class="ml-1 mt-0.5 h-3.5 w-3.5" />
        </a>
        <CommonButton
          :disabled="buttonDisabled || newFeeAlert || status !== 'not-started'"
          class="mx-auto mt-3"
          variant="primary-solid"
          @click="makeTransaction"
        >
          <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
            <span v-if="status === 'processing'">Processing...</span>
            <span v-else-if="status === 'waiting-for-signature'">Waiting for confirmation</span>
            <span v-else-if="status === 'committing'">Sending...</span>
            <span v-else>Send to {{ destination.label }}</span>
          </transition>
        </CommonButton>
        <transition v-bind="TransitionHeight()">
          <div v-if="status === 'waiting-for-signature'" class="h-6 text-center text-sm font-medium text-gray-500">
            <div class="pt-1"></div>
            Confirm this transaction in your wallet
          </div>
        </transition>
      </div>
    </div>
  </CommonModal>
  <TransactionSuccessfulModal v-else v-bind="$attrs" :transaction-hashes="transactionHashes">
    <template #after-transactions>
      <CommonAlert
        v-if="destination.key === 'ethereum'"
        class="sticky bottom-0 mt-3"
        variant="neutral"
        :icon="InformationCircleIcon"
      >
        <p>
          It can take <span class="font-medium">up to 7 hours</span> until funds arrive on
          <span class="font-medium">{{ destinations.ethereum.label }}</span> (L1)
        </p>
        <a href="https://docs.zksync.io/userdocs/faq/#how-long-are-withdrawal-times" target="_blank" class="alert-link">
          Learn more
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>
    </template>
  </TransactionSuccessfulModal>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { storeToRefs } from "pinia";

import TransactionSuccessfulModal from "@/components/transaction/zksync/lite/TransactionSuccessfulModal.vue";

import useTransaction from "@/composables/zksync/lite/useTransaction";

import type { TransactionDestination } from "@/store/destinations";
import type { ZkSyncLiteToken } from "@/store/zksync/lite/tokens";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";
import type { IncomingTxFeeType } from "zksync/build/types";

import { useDestinationsStore } from "@/store/destinations";
import { usePreferencesStore } from "@/store/preferences";
import { useLiteAccountActivationStore } from "@/store/zksync/lite/accountActivation";
import { useLiteTransactionsHistoryStore } from "@/store/zksync/lite/transactionsHistory";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { TransitionHeight, TransitionPrimaryButtonText } from "@/utils/transitions";

export type ConfirmationModalTransaction = {
  type: IncomingTxFeeType;
  to: string;
  token: ZkSyncLiteToken;
  amount: BigNumberish;
};

const props = defineProps({
  transactions: {
    type: Array as PropType<ConfirmationModalTransaction[]>,
  },
  feeToken: {
    type: Object as PropType<ZkSyncLiteToken>,
  },
  fee: {
    type: String as PropType<BigNumberish>,
  },
  destination: {
    type: Object as PropType<TransactionDestination>,
    required: true,
  },
  accountActivation: {
    type: Boolean,
    default: false,
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
const liteAccountActivationStore = useLiteAccountActivationStore();
const walletLiteStore = useLiteWalletStore();
const { walletAddress } = storeToRefs(walletLiteStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { previousTransactionAddress } = storeToRefs(usePreferencesStore());
const { status, error, transactionHashes, commitTransaction } = useTransaction(() =>
  walletLiteStore.getWalletInstance(true)
);

const lastFee = ref(props.fee);
watch(
  () => props.fee,
  (newFee) => {
    if (newFee) {
      lastFee.value = newFee;
    }
  }
);

const newFeeAlert = ref(false);

const computedTransactions = computed(() => props.transactions ?? []);

const totalOfEachToken = computed<{ token: ZkSyncLiteToken; amount: BigNumberish }[]>(() => {
  const tokenBySymbol: { [symbol: string]: ZkSyncLiteToken } = Object.fromEntries(
    computedTransactions.value.map((e) => [e.token.symbol, e.token])
  );
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

  for (const transaction of computedTransactions.value) {
    addToTotal(transaction.token.symbol, transaction.amount);
  }

  if (props.feeToken && lastFee.value) {
    addToTotal(props.feeToken.symbol, lastFee.value);
  }

  return Object.entries(totalBySymbol).map(([symbol, amount]) => ({
    token: tokenBySymbol[symbol],
    amount: amount.toString(),
  }));
});

const getActionName = (type: IncomingTxFeeType) => {
  if (type === "Transfer") return "Sending";
  else if (type === "Withdraw") return "Withdrawing";
  return "Transaction";
};

const makeTransaction = async () => {
  if (!props.feeToken || !props.fee) return;

  const fee = BigNumber.from(lastFee.value);

  await props.estimate();

  if (fee.lt(props.fee)) {
    newFeeAlert.value = true;
  }

  if (newFeeAlert.value || props.buttonDisabled) return;

  const tx = await commitTransaction(
    computedTransactions.value.map((e) => ({
      type: e.type,
      to: e.to,
      symbol: e.token.symbol,
      amount: e.amount,
    })),
    props.feeToken.symbol,
    props.fee,
    props.accountActivation
      ? await liteAccountActivationStore.getAccountActivationTransaction(props.feeToken.id)
      : undefined
  );

  if (status.value === "done") {
    previousTransactionAddress.value = computedTransactions.value[0].to;
  }

  if (tx) {
    /* Have to wait because for further transactions account needs to be activated, otherwise do it async */
    if (liteAccountActivationStore.isAccountActivated === false) {
      await tx[0].awaitReceipt();
    }
    tx[0].awaitReceipt().then(async () => {
      liteTransactionsHistoryStore.reloadRecentTransactions();
      walletLiteStore.requestBalance({ force: true });
      if (liteAccountActivationStore.isAccountActivated === false) {
        liteAccountActivationStore.checkAccountActivation();
      }
    });
  }
};
</script>

<style lang="scss">
.confirm-transaction-modal .modal-card {
  @apply grid h-full grid-rows-[max-content_1fr];
}
</style>
