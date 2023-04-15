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
            :destination="destinations.zkSyncLite"
            :tooltip="`${getActionName(item.type)} to ${destinations.zkSyncLite.label} (L2)`"
          />
        </CommonCardWithLineButtons>
        <TransactionItemIcon v-if="index !== computedTransactions.length - 1" :icon="PlusIcon" />
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
        <CommonErrorBlock v-if="error" :retry-button="false" class="mx-4 mt-3">
          {{ error.message }}
        </CommonErrorBlock>
        <CommonButton
          :disabled="status !== 'not-started'"
          class="mx-auto mt-3"
          variant="primary-solid"
          @click="makeTransaction"
        >
          <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
            <span v-if="status === 'processing'">Processing...</span>
            <span v-else-if="status === 'waiting-for-signature'">Waiting for confirmation</span>
            <span v-else-if="status === 'committing'">Sending...</span>
            <span v-else>Send to {{ destinations.zkSyncLite.label }}</span>
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
  <TransactionSuccessfulModal v-else v-bind="$attrs" :transactions="computedTransactions" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ArrowDownIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { storeToRefs } from "pinia";

import TransactionSuccessfulModal from "@/components/transaction/zksync/lite/TransactionSuccessfulModal.vue";

import useTransaction from "@/composables/zksync/lite/useTransaction";

import type { ZkSyncLiteToken } from "@/store/zksync/lite/tokens";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";
import type { IncomingTxFeeType } from "zksync/build/types";

import { useDestinationsStore } from "@/store/destinations";
import { usePreferencesStore } from "@/store/preferences";
import { useLiteAccountActivationStore } from "@/store/zksync/lite/accountActivation";
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
  accountActivation: {
    type: Boolean,
    default: false,
  },
});

const liteAccountActivationStore = useLiteAccountActivationStore();
const walletLiteStore = useLiteWalletStore();
const { walletAddress } = storeToRefs(walletLiteStore);
const { destinations } = storeToRefs(useDestinationsStore());
const { lastTransactionAddress } = storeToRefs(usePreferencesStore());
const { status, error, commitTransaction } = useTransaction(() => walletLiteStore.getWalletInstance(true));

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

  if (props.feeToken && props.fee) {
    addToTotal(props.feeToken.symbol, props.fee);
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

  await commitTransaction(
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
    lastTransactionAddress.value = computedTransactions.value[0].to;
  }
};
</script>

<style lang="scss">
.confirm-transaction-modal .modal-card {
  @apply grid h-full grid-rows-[max-content_1fr];
}
</style>
