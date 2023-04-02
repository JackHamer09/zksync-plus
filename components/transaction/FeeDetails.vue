<template>
  <div class="fee-details-container">
    <span>{{ label }}</span>
    <div>
      <template v-if="loading">
        <CommonContentLoader :length="30" />
      </template>
      <span
        v-else-if="feeToken && feeAmount"
        :title="canDisplayFeeAsFiat ? 'Click to change how fee is displayed' : ''"
        class="flex items-center justify-end"
        :class="{ 'cursor-pointer': canDisplayFeeAsFiat }"
        @click="displayFeeAsFiat = !displayFeeAsFiat"
      >
        <template v-if="canDisplayFeeAsFiat && displayFeeAsFiat">
          <span>
            <template v-if="feeToken.price === 'loading'">
              <CommonContentLoader :length="15" />
            </template>
            <template v-else>{{ totalPrice }}</template>
            of
          </span>
        </template>
        <template v-else>
          <span class="font-medium">{{ parseTokenAmount(feeAmount, feeToken.decimals) }}</span>
        </template>
        <TokenImage class="ml-0.5 h-5 w-5" v-bind="feeToken" />
        <span class="font-medium">{{ feeToken.symbol }}</span>
      </span>
      <template v-else>Unknown fee</template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import type { ZkSyncLiteToken } from "@/store/zksync/lite/tokens";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

import { formatTokenPrice, parseTokenAmount } from "@/utils/formatters";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  feeAmount: {
    type: String as PropType<BigNumberish>,
  },
  feeToken: {
    type: Object as PropType<ZkSyncLiteToken>,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const canDisplayFeeAsFiat = computed(() => (props.feeToken?.price ? true : false));
const displayFeeAsFiat = ref(canDisplayFeeAsFiat.value);

const totalPrice = computed(() => {
  if (typeof props.feeToken?.price !== "number" || !props.feeAmount) {
    return "";
  }
  return formatTokenPrice(props.feeAmount, props.feeToken.decimals, props.feeToken.price);
});
</script>

<style lang="scss" scoped>
.fee-details-container {
  @apply mt-1 flex justify-between rounded-lg py-1.5 px-4 text-sm text-gray-secondary;
}
</style>
