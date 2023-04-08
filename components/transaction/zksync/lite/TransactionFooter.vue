<template>
  <div class="transaction-footer">
    <ModalZksyncLiteWalletAuthorization v-model:opened="modalWalletAuthorizationOpened" />
    <ModalZksyncLiteAccountActivation v-model:opened="modalAccountActivationOpened" />

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
        Account activation error: {{ accountActivationSigningError.message }}
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
          <NuxtLink class="font-medium underline underline-offset-2" :to="{ name: 'balances' }">balances</NuxtLink> to
          add balance, and wait for deposited funds to become available.
        </p>
      </CommonAlert>
    </transition>

    <div v-if="buttonStep === 'authorize'" class="transaction-footer-row">
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useLiteAccountActivationStore } from "@/store/zksync/lite/accountActivation";
import { useLiteWalletStore } from "@/store/zksync/lite/wallet";
import { TransitionAlertScaleInOutTransition } from "@/utils/transitions";

const walletLiteStore = useLiteWalletStore();
const liteAccountActivationStore = useLiteAccountActivationStore();

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
  if (!isAuthorized.value || authorizationInProgress.value || accountActivationCheckInProgress.value) {
    return "authorize";
  } else if (isAccountActivated.value === false && !isAccountActivationSigned.value) {
    return "activate";
  } else {
    return "continue";
  }
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
