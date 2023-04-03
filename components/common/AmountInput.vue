<template>
  <div>
    <TokenSelectDropdown
      v-model:opened="selectTokenModalOpened"
      v-model:token-address="selectedTokenAddress"
      :loading="loading"
      :balances="balances"
    />
    <label class="amount-input-container" :class="{ focused, loading }">
      <div class="amount-input-token">
        <CommonContentLoader v-if="loading" :length="10" />
        <template v-else-if="selectedToken">
          <div class="flex items-center">
            <TokenImage class="-ml-0.5 h-5 w-5" v-bind="selectedToken" />
            <span class="ml-1 inline-block">{{ selectedToken.symbol }}</span>
          </div>
        </template>
      </div>
      <div class="amount-input-field-container">
        <transition
          enter-active-class="transition ease-in duration-250"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="maxDecimalAmount && maxAmount !== '0'"
            class="amount-input-max-button"
            :class="{ 'is-max': isMaxAmount }"
            :title="isMaxAmount ? 'Max amount is set' : `Your max amount is ${maxDecimalAmount}`"
            @click.prevent="inputted = maxDecimalAmount!"
          >
            Max
          </div>
        </transition>
        <input
          ref="inputElement"
          v-model="inputted"
          class="amount-input-field"
          placeholder="0"
          type="text"
          maxlength="20"
          spellcheck="false"
          :style="{ width: `${inputWidth}px` }"
        />
      </div>
      <div class="amount-input-select-asset">
        <CommonContentLoader v-if="loading" :length="35" />
        <div v-else class="flex items-center" @click.prevent="selectTokenModalOpened = true">
          <template v-if="selectedToken">
            <span>
              Balance:
              {{ selectedToken.symbol }}
              {{ parseTokenAmount(selectedToken.amount, selectedToken.decimals) }}
            </span>
          </template>
          <template v-else>Select token</template>
          <ChevronDownIcon class="ml-1.5 h-4 w-4" aria-hidden="true" />
        </div>
      </div>
      <transition
        enter-active-class="transition ease-in duration-150"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="inputted" class="amount-input-note">
          <template v-if="selectedToken?.price === 'loading'">
            <CommonContentLoader class="shadow-sm" :length="15" />
          </template>
          <template v-else>
            {{ totalAmountPrice }}
          </template>
        </div>
      </transition>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";

import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useFocus } from "@vueuse/core";
import { BigNumber } from "ethers";

import type { Balance } from "@/store/zksync/lite/wallet";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { decimalToBigNumber, formatTokenPrice, parseTokenAmount } from "@/utils/formatters";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  balances: {
    type: Array as PropType<Balance[]>,
    default: () => [],
    required: true,
  },
  tokenAddress: {
    type: String,
  },
  maxAmount: {
    type: String as PropType<BigNumberish>,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", amount: string): void;
  (eventName: "update:tokenAddress", tokenAddress?: string): void;
}>();

const selectedTokenAddress = computed({
  get: () => props.tokenAddress,
  set: (value?: string) => emit("update:tokenAddress", value),
});
const selectedToken = computed(() => {
  if (!props.balances) {
    return undefined;
  }
  return props.balances.find((e) => e.address === props.tokenAddress);
});
const selectTokenModalOpened = ref(false);

const inputElement = ref<HTMLInputElement | null>(null);
const { focused } = useFocus(inputElement, { initialValue: !!props.autofocus });
const inputWidth = ref(0);

const inputted = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});
watch([inputted, inputElement], () => {
  recalculateInputWidth();
});

const totalComputeAmount = computed(() => {
  try {
    if (!inputted.value || !selectedToken.value) {
      return BigNumber.from("0");
    }
    return decimalToBigNumber(inputted.value.replace(",", "."), selectedToken.value.decimals);
  } catch (error) {
    return BigNumber.from("0");
  }
});
const totalAmountPrice = computed(() => {
  if (!selectedToken.value || !selectedToken.value.price || selectedToken.value.price === "loading") {
    return "";
  }
  return formatTokenPrice(totalComputeAmount.value, selectedToken.value.decimals, selectedToken.value.price);
});
const maxDecimalAmount = computed(() => {
  if (!props.maxAmount || !selectedToken.value) {
    return;
  }
  return parseTokenAmount(props.maxAmount, selectedToken.value.decimals);
});
const isMaxAmount = computed(() => {
  if (!props.maxAmount) {
    return false;
  }
  return totalComputeAmount.value.eq(props.maxAmount);
});

const recalculateInputWidth = () => {
  inputWidth.value = 0;
  nextTick(() => {
    if (!inputElement.value) return;
    inputWidth.value = inputElement.value.scrollWidth;
  });
};
</script>

<style lang="scss" scoped>
.amount-input-container {
  @apply grid w-full gap-x-4 rounded-xl bg-gray-input p-4 transition-colors;
  grid-template-areas:
    "a b b b"
    "c c d d";
  &:not(.loading) {
    &.focused {
      @apply bg-gray-input-focus;

      .small-input-clear-button {
        @apply bg-gray-400;
      }
    }
  }

  .amount-input-token {
    @apply text-xl font-medium leading-[1.4] text-gray-900;
    grid-area: a / a / a / a;
  }
  .amount-input-field-container {
    grid-area: b / b / b / b;
    @apply flex items-center justify-end gap-2 overflow-hidden pl-2;

    .amount-input-max-button {
      @apply rounded bg-primary-100/50 px-1.5 py-1 text-xs font-medium uppercase text-primary-400 transition-all;
      &:not(.is-max) {
        @apply cursor-pointer hover:bg-primary-100;
      }
      &.is-max {
        @apply bg-primary-600 text-white;
      }
    }
    .amount-input-field {
      @apply block w-max min-w-[15px] overflow-hidden border-none bg-transparent text-right text-xl font-medium outline-none placeholder:text-gray-secondary;
    }
  }
  .amount-input-select-asset,
  .amount-input-note {
    @apply mt-1 break-all text-sm text-gray-secondary xs:w-max;
  }
  .amount-input-select-asset {
    @apply flex cursor-pointer items-center whitespace-pre-line transition-colors hover:text-gray-400;
    grid-area: c / c / c / c;
  }
  .amount-input-note {
    @apply justify-self-end text-right;
    grid-area: d / d / d / d;
  }
}
</style>
