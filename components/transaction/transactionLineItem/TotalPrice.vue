<template>
  <div class="transaction-line-item-price">
    <template v-if="loading">
      <CommonContentLoader :length="12" />
    </template>
    <template v-else-if="token.price && !isZeroAmount">
      <span v-if="direction">{{ direction === "in" ? "+" : "-" }}</span
      >{{ formatTokenPrice(amount, token.decimals, token.price as number) }}
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { BigNumber } from "ethers";

import type { ZkSyncLiteToken } from "@/store/zksync/lite/tokens";
import type { BigNumberish } from "ethers";
import type { PropType } from "vue";

const props = defineProps({
  token: {
    type: Object as PropType<ZkSyncLiteToken>,
    required: true,
  },
  amount: {
    type: String as PropType<BigNumberish>,
    required: true,
  },
  direction: {
    type: String as PropType<"in" | "out" | undefined>,
  },
  loading: {
    type: Boolean,
  },
});

const isZeroAmount = computed(() => {
  return BigNumber.from(props.amount).isZero();
});
</script>
