<template>
  <TransactionLineItem
    :icon="icon"
    :direction="direction"
    :to="transaction.to"
    :label="label"
    :transaction-hash="transaction.txHash"
    :block-explorer-url="blockExplorerUrl"
    :token="token"
    :amount="computeAmount.toString()"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ArrowLeftIcon, ArrowRightIcon, ArrowsRightLeftIcon, ShieldCheckIcon } from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { storeToRefs } from "pinia";

import type { ZkSyncLiteTransaction } from "@/utils/zksync/lite/mappers";
import type { Component, PropType } from "vue";

import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { isBigNumber } from "@/utils/validators";

const props = defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
  walletAddress: {
    type: String,
    required: true,
  },
  transaction: {
    type: Object as PropType<ZkSyncLiteTransaction>,
    required: true,
  },
});

const { blockExplorerUrl } = storeToRefs(useLiteProviderStore());

const label = computed(() => {
  if (props.transaction.isFeeTransaction) {
    return "Fee payment";
  } else if (props.transaction.type === "ChangePubKey") {
    return "Account activation";
  }
  return props.transaction.type;
});
const hasAmount = computed(() => {
  return isBigNumber(props.transaction.amount);
});
const computeAmount = computed(() => {
  if (props.transaction.isFeeTransaction || !hasAmount.value) {
    return BigNumber.from(props.transaction.feeAmount);
  }
  if (props.transaction.token?.isNFT === false) {
    if (hasAmount.value) {
      return BigNumber.from(props.transaction.amount);
    }
  }
  return BigNumber.from("0");
});
const token = computed(() => {
  if (props.transaction.isFeeTransaction || !hasAmount.value) {
    return props.transaction.feeToken;
  }
  return props.transaction.token;
});

const direction = computed(() => {
  if (props.transaction.isFeeTransaction) {
    return "out";
  }
  switch (props.transaction.type) {
    case "Transfer":
      return props.transaction.to === props.walletAddress ? "in" : "out";
    case "Withdraw":
      return "out";
    default:
      return undefined;
  }
});
const icon = computed(() => {
  if (direction.value) {
    return direction.value === "in" ? ArrowLeftIcon : ArrowRightIcon;
  }
  switch (props.transaction.type) {
    case "ChangePubKey":
      return ShieldCheckIcon;
    case "Swap":
      return ArrowsRightLeftIcon;
    default:
      return undefined;
  }
});
</script>
