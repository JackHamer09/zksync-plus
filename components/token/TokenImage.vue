<template>
  <div class="token-image-container">
    <div class="token-placeholder"></div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0"
    >
      <img v-if="isReady && !error" class="token-image" :src="imgSrc" :alt="`${symbol} token icon`" />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { useImage } from "@vueuse/core";

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const imgSrc = computed(() => {
  // check if its ETH address
  if (props.address === "0x0000000000000000000000000000000000000000") {
    return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png";
  }
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${props.address}/logo.png`;
});
const { isReady, error } = useImage({
  src: imgSrc.value,
});
</script>

<style lang="scss" scoped>
.token-image-container {
  @apply relative;

  .token-image {
    @apply absolute inset-0 h-full w-full rounded-full p-1;
  }
  .token-placeholder {
    @apply relative h-full w-full rounded-full border border-dashed;
    &::before {
      content: "";
      @apply absolute inset-0 m-[3px] rounded-full bg-gray-100;
    }
  }
}
</style>
