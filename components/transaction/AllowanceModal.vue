<template>
  <CommonModal
    v-if="!transactionStarted"
    v-bind="$attrs"
    :close-on-background-click="status === 'not-started'"
    class="allowance-transaction-modal"
    title="Allowance"
  >
    <div class="flex h-full flex-col overflow-auto">
      <template v-if="transaction">
        <CommonCardWithLineButtons>
          <AddressCardParsed
            :address="account.address!"
            :destination="destinations.ethereum"
            :tooltip="`Approve allowance for ${destination.label}`"
          />
        </CommonCardWithLineButtons>
        <TransactionItemIcon :icon="LockOpenIcon" />
        <CommonCardWithLineButtons>
          <TokenBalance v-bind="transaction.token" as="div" :amount="transaction.amount" :show-send-button="false" />
          <div class="-mx-1 border-b border-dashed"></div>
          <DestinationItem v-bind="destination" as="div" description="Approving allowance for deposit" />
        </CommonCardWithLineButtons>
      </template>
      <CommonAlert class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>
          Allowance lets you safely authorize the deposit process to access a specific amount of your tokens. No funds
          will be deducted after signing, except for
          <span class="font-medium">{{ destinations.ethereum.label }}</span> transaction fee
        </p>
        <a :href="TOKEN_ALLOWANCE" target="_blank" class="alert-link">
          Learn more
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>

      <div class="sticky bottom-0 z-[1] mt-auto w-full bg-gray bg-opacity-60 backdrop-blur-sm">
        <div class="mx-4 mb-3 border-t border-dashed border-gray-300"></div>
        <div v-if="error" class="mx-4">
          <CommonErrorBlock :retry-button="false" class="mt-3">
            {{ error.message }}
          </CommonErrorBlock>
        </div>
        <CommonButton
          :disabled="status !== 'not-started'"
          class="mx-auto mt-3"
          variant="primary-solid"
          @click="makeTransaction"
        >
          <transition v-bind="TransitionPrimaryButtonText" mode="out-in">
            <span v-if="status === 'waiting-for-signature'">Waiting for confirmation</span>
            <span v-else>Approve allowance</span>
          </transition>
        </CommonButton>
        <CommonHeightTransition :opened="status === 'waiting-for-signature'">
          <div class="text-center text-sm font-medium text-gray-500">
            <div class="pt-1"></div>
            Confirm this transaction in your {{ walletName }} wallet
          </div>
        </CommonHeightTransition>
      </div>
    </div>
  </CommonModal>

  <CommonModal
    v-else
    v-bind="$attrs"
    :closable="transactionCommitted"
    :close-on-background-click="false"
    class="allowance-transaction-successful-modal"
    title=""
  >
    <template #animation>
      <Vue3Lottie v-if="!transactionCommitted" class="mt-4 w-64" :animation-data="ProgressBlocks" loop />
      <Vue3Lottie v-else class="w-32" :animation-data="SuccessUnlock" :loop="false" />
    </template>

    <div class="flex h-full flex-col overflow-auto">
      <div class="h2 text-center sm:h1">
        {{ transactionCommitted ? "Allowance approved" : "Approving allowance" }}
      </div>
      <CommonCardWithLineButtons v-if="transaction">
        <TransactionLineItem
          :icon="LockOpenIcon"
          :transaction-url="`${blockExplorerUrl}/tx/${transactionReceipt?.hash}`"
        >
          <template #top-left>
            <div class="transaction-line-label">Allowance</div>
          </template>
          <template #top-right>
            <TokenAmount :token="transaction.token" :amount="transaction.amount" />
          </template>
          <template #bottom-right>
            <div class="transaction-line-item-price">Approved amount</div>
          </template>
        </TransactionLineItem>
      </CommonCardWithLineButtons>

      <CommonAlert v-if="!transactionCommitted" class="mt-3" variant="neutral" :icon="InformationCircleIcon">
        <p>
          Please wait until <span class="font-medium">{{ transaction?.token.symbol }}</span> allowance transaction for
          <span class="font-medium">{{ destination.label }}</span> is committed on
          <span class="font-medium">{{ destinations.ethereum.label }}</span
          >.
        </p>
        <a :href="`${blockExplorerUrl}/tx/${transactionReceipt?.hash}`" target="_blank" class="alert-link">
          Track status
          <ArrowUpRightIcon class="ml-1 h-3 w-3" />
        </a>
      </CommonAlert>
      <CommonAlert v-else class="mt-3" variant="success" :icon="InformationCircleIcon">
        <p>
          Allowance for <span class="font-medium">{{ transaction?.token.symbol }}</span> is successfully approved for
          <span class="font-medium">{{ destination.label }}</span> network. You can now proceed with the deposit
        </p>
      </CommonAlert>

      <div class="sticky bottom-0 z-[1] mt-auto flex w-full flex-col items-center">
        <transition v-bind="TransitionAlertScaleInOutTransition">
          <CommonButton
            v-if="transactionCommitted"
            class="mx-auto mt-8"
            variant="primary-solid"
            @click="emit('continue')"
          >
            Continue
          </CommonButton>
        </transition>
      </div>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Vue3Lottie } from "vue3-lottie";

import { ArrowUpRightIcon, InformationCircleIcon, LockOpenIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import TokenAmount from "@/components/transaction/transactionLineItem/TokenAmount.vue";

import usePromise from "@/composables/usePromise";

import ProgressBlocks from "@/assets/lottie/progress-blocks.json";
import SuccessUnlock from "@/assets/lottie/success-unlock.json";

import type { TransactionDestination } from "@/store/destinations";
import type { Token } from "@/types";
import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { BigNumberish, ContractTransaction } from "ethers";
import type { PropType } from "vue";

import { useDestinationsStore } from "@/store/destinations";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { TOKEN_ALLOWANCE } from "@/utils/doc-links";
import { formatError } from "@/utils/formatters";
import { TransitionAlertScaleInOutTransition, TransitionPrimaryButtonText } from "@/utils/transitions";

export type ConfirmationModalTransaction = {
  to: string;
  token: Token;
  amount: BigNumberish;
};

const props = defineProps({
  destination: {
    type: Object as PropType<TransactionDestination>,
    required: true,
  },
  transaction: {
    type: Object as PropType<ConfirmationModalTransaction>,
  },
  getAllowance: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },
  setAllowance: {
    type: Function as PropType<() => Promise<ContractTransaction>>,
    required: true,
  },
  fetchBalance: {
    type: Function as PropType<() => Promise<void>>,
    required: true,
  },
});

const emit = defineEmits<{
  (eventName: "continue"): void;
}>();

const { account, walletName } = storeToRefs(useOnboardStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { blockExplorerUrl } = storeToRefs(useNetworkStore());

const status = ref<"not-started" | "waiting-for-signature" | "committing" | "processing" | "done">("not-started");
const transactionReceipt = ref<TransactionResponse | undefined>();
const transactionCommitted = computed(() => status.value === "done");
const transactionStarted = computed(() => status.value === "committing" || transactionCommitted.value);

const { execute: makeTransaction, error } = usePromise(
  async () => {
    try {
      status.value = "waiting-for-signature";
      const tx = await props.setAllowance();

      status.value = "committing";
      transactionReceipt.value = tx;
      await tx.wait();

      await Promise.all([props.fetchBalance(), props.getAllowance()]);
      status.value = "done";
    } catch (err) {
      status.value = "not-started";
      const error = formatError(err as Error);
      if (error) throw error;
    }
  },
  { cache: false }
);
</script>

<style lang="scss">
.allowance-transaction-modal .modal-card {
  @apply grid h-full grid-rows-[max-content_1fr];
}
.allowance-transaction-successful-modal .modal-card {
  @apply grid h-full grid-rows-[0_max-content_1fr];
}
</style>
