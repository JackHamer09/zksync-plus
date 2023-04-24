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

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  PhotoIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "@heroicons/vue/24/outline";
import { BigNumber } from "ethers";
import { storeToRefs } from "pinia";

import type { ZkSyncLiteTransaction } from "@/utils/zksync/lite/mappers";
import type { Component, PropType } from "vue";

import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { isBigNumber } from "@/utils/validators";

const props = defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
  transaction: {
    type: Object as PropType<ZkSyncLiteTransaction>,
    required: true,
  },
});

const { account } = storeToRefs(useOnboardStore());
const { blockExplorerUrl } = storeToRefs(useLiteProviderStore());

const label = computed(() => {
  if (props.transaction.isFeeTransaction) {
    return "Fee payment";
  } else if (props.transaction.type === "ChangePubKey") {
    return "Account activation";
  } else if (props.transaction.type === "MintNFT") {
    return "Mint NFT";
  } else if (props.transaction.type === "TransferNFT") {
    return "Transfer";
  } else if (props.transaction.type === "WithdrawNFT") {
    return "Withdraw";
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
    case "TransferNFT":
      if (props.transaction.to === props.transaction.from) {
        return undefined;
      }
      return props.transaction.to === account.value.address ? "in" : "out";

    case "Deposit":
      return props.transaction.to === account.value.address ? "in" : "out";

    case "Withdraw":
    case "WithdrawNFT":
    case "ChangePubKey":
      return "out";

    default:
      return undefined;
  }
});
const icon = computed(() => {
  switch (props.transaction.type) {
    case "Transfer":
      if (!direction.value) {
        return ArrowRightIcon;
      }
      break;
    case "ChangePubKey":
      return ShieldCheckIcon;
    case "Swap":
      return ArrowsRightLeftIcon;
    case "Deposit":
      return PlusIcon;
    case "MintNFT":
      return PhotoIcon;
  }
  if (direction.value) {
    return direction.value === "in" ? ArrowRightIcon : ArrowLeftIcon;
  }
  return undefined;
});
</script>
