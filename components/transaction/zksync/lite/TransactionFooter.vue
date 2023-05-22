<template>
  <div class="transaction-footer">
    <ModalZksyncLiteWalletAuthorization v-model:opened="modalWalletAuthorizationOpened" />
    <ModalZksyncLiteAccountActivation v-model:opened="modalAccountActivationOpened" />

    <!-- Change network -->
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonErrorBlock
        v-if="buttonStep === 'network' && switchingNetworkError"
        class="mb-2"
        @try-again="onboardStore.setCorrectNetwork"
      >
        Network change error: {{ switchingNetworkError.message }}
      </CommonErrorBlock>
    </transition>

    <!-- Authorize -->
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonErrorBlock
        v-if="buttonStep === 'authorize' && authorizationError"
        class="mb-2"
        @try-again="authorizeWallet"
      >
        Authorization error: {{ authorizationError.message }}
      </CommonErrorBlock>
    </transition>

    <!-- Activate -->
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonErrorBlock
        v-if="buttonStep === 'activate' && accountActivationSigningError"
        class="mb-2"
        @try-again="signAccountActivation"
      >
        Signing account activation error: {{ accountActivationSigningError.message }}
      </CommonErrorBlock>
    </transition>
    <transition v-bind="TransitionAlertScaleInOutTransition">
      <CommonAlert
        v-if="buttonStep === 'activate' && !canSignAccountActivation"
        variant="error"
        :icon="ExclamationTriangleIcon"
        class="mb-2"
      >
        <p>
          To activate your account, you need a history of committed balance. Visit
          <NuxtLink class="font-medium underline underline-offset-2" :to="{ name: 'transaction-zksync-lite-deposit' }"
            >Add funds</NuxtLink
          >
          page to add balance, and wait for deposited funds to become available on
          <span class="font-medium">{{ destinations.zkSyncLite.label }}</span
          >.
        </p>
      </CommonAlert>
    </transition>

    <div v-if="buttonStep === 'network'" class="transaction-footer-row">
      <div class="mb-2 text-sm text-gray-secondary">Incorrect network selected in your {{ walletName }} wallet</div>
      <CommonButton
        :disabled="switchingNetworkInProgress"
        variant="primary-solid"
        @click="onboardStore.setCorrectNetwork"
      >
        Change wallet network to {{ selectedEthereumNetwork.name }}
      </CommonButton>
    </div>
    <div v-else-if="buttonStep === 'authorize'" class="transaction-footer-row">
      <button class="link mb-2 text-sm underline-offset-2" @click="modalWalletAuthorizationOpened = true">
        What is authorization?
      </button>
      <CommonButton
        :disabled="authorizationInProgress || accountActivationCheckInProgress"
        variant="primary-solid"
        @click="authorizeWallet"
      >
        Authorize to continue
      </CommonButton>
    </div>
    <div v-else-if="buttonStep === 'activate'" class="transaction-footer-row">
      <button class="link mb-2 text-sm underline-offset-2" @click="modalAccountActivationOpened = true">
        What is account activation?
      </button>
      <CommonButton
        :disabled="!canSignAccountActivation || accountActivationSigningInProgress"
        variant="primary-solid"
        @click="signAccountActivation"
      >
        Sign account activation
      </CommonButton>
    </div>
    <div v-else-if="buttonStep === 'continue'" class="transaction-footer-row">
      <slot name="after-checks" />
    </div>

    <transition v-bind="TransitionHeight()">
      <div
        v-if="continueInWalletTipDisplayed"
        class="h-6 whitespace-nowrap text-center text-sm font-medium text-gray-500"
      >
        <div class="pt-1"></div>
        Continue in your {{ walletName }} wallet
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useDestinationsStore } from "@/store/destinations";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useLiteAccountActivationStore } from "@/store/zksync/lite/accountActivation";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { TransitionAlertScaleInOutTransition } from "@/utils/transitions";

const props = defineProps({
  authorization: {
    type: Boolean,
    default: true,
  },
  accountActivation: {
    type: Boolean,
    default: true,
  },
});

const onboardStore = useOnboardStore();
const walletLiteStore = useLiteWalletStore();
const liteAccountActivationStore = useLiteAccountActivationStore();

const { isCorrectNetworkSet, switchingNetworkInProgress, switchingNetworkError, walletName } =
  storeToRefs(onboardStore);
const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());
const { destinations } = storeToRefs(useDestinationsStore());
const { isAuthorized, authorizationInProgress, authorizationError } = storeToRefs(walletLiteStore);
const {
  isAccountActivated,
  accountActivationCheckInProgress,
  isAccountActivationSigned,
  canSignAccountActivation,
  accountActivationSigningInProgress,
  accountActivationSigningError,
} = storeToRefs(liteAccountActivationStore);

const modalWalletAuthorizationOpened = ref(false);
const modalAccountActivationOpened = ref(false);

const buttonStep = computed(() => {
  if (!isCorrectNetworkSet.value && !isAuthorized.value) {
    return "network";
  } else if (
    props.authorization &&
    (!isAuthorized.value || authorizationInProgress.value || accountActivationCheckInProgress.value)
  ) {
    return "authorize";
  } else if (props.accountActivation && isAccountActivated.value === false && !isAccountActivationSigned.value) {
    return "activate";
  } else {
    return "continue";
  }
});

const continueInWalletTipDisplayed = computed(() => {
  if (
    (buttonStep.value === "network" && switchingNetworkInProgress.value) ||
    (buttonStep.value === "authorize" && authorizationInProgress.value) ||
    (buttonStep.value === "activate" && accountActivationSigningInProgress.value)
  ) {
    return true;
  }
  return false;
});

const authorizeWallet = () => {
  walletLiteStore.authorizeWallet().catch(() => undefined);
};
const signAccountActivation = () => {
  liteAccountActivationStore.accountActivationSign().catch(() => undefined);
};
</script>

<style lang="scss" scoped>
.transaction-footer {
  @apply sticky bottom-0 z-[2] mt-auto flex flex-col items-center bg-gray bg-opacity-60 pb-2 pt-4 backdrop-blur-sm;

  .transaction-footer-row {
    @apply flex w-full flex-col items-center;
  }
}
</style>
