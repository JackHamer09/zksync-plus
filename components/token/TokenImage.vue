<template>
  <div class="token-image-container">
    <transition
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div v-if="!isReady || error" class="token-placeholder"></div>
    </transition>
    <img
      v-if="imgSrc"
      class="token-image"
      :class="{ loaded: isReady && !error }"
      :src="imgSrc"
      :alt="`${symbol} token icon`"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { useImage } from "@vueuse/core";

import type { PropType } from "vue";

import { getTokenIconUrlBySymbol } from "~~/utils/tokens/lite";

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  size: {
    type: String as PropType<"thumb" | "small" | "large">,
    default: "small",
  },
  zksync: {
    type: String as PropType<"lite" | "era">,
    default: "lite",
  },
});

const imgSrc = computed(() => {
  if (props.zksync === "lite") {
    return getTokenIconUrlBySymbol(props.symbol, props.size);
  }
  return undefined;
});
const { isReady, error } = imgSrc.value
  ? useImage({
      src: imgSrc.value,
    })
  : { isReady: computed(() => true), error: computed(() => true) };
</script>

<style lang="scss" scoped>
.token-image-container {
  @apply relative;

  .token-image {
    @apply absolute inset-0 h-full w-full rounded-full object-contain opacity-0 transition-opacity duration-100;
    &.loaded {
      @apply opacity-100;
    }
  }
  .token-placeholder {
    @apply absolute inset-0 h-full w-full rounded-full border border-dashed;
    &::before {
      content: "";
      @apply absolute inset-0 m-[3px] rounded-full bg-gray-100;
    }
  }
}
</style>
