<template>
  <Vue3Lottie class="progress-blocks-animation" :animation-data="ProgressBlocks" loop />
</template>

<script lang="ts" setup>
import ProgressBlocks from "@/assets/lottie/progress-blocks.json";
</script>

<style lang="scss">
.progress-blocks-animation {
  .primary-colored-cube g {
    &:nth-child(2) path {
      @apply fill-[#8FACFD] lite:fill-primary-200;
    }
    &:nth-child(3) path {
      @apply fill-primary-800 lite:fill-primary-600;
    }
    &:nth-child(4) path {
      @apply fill-primary-700 lite:fill-[#6668C7];
    }
  }
}
</style>
