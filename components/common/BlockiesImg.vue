<template>
  <img :src="imgSrc" alt="" class="navbar-desktop-account-icon" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import * as blockies from "blockies-ts";

const props = defineProps({
  address: String,
});

const imgSrc = computed(() => {
  return blockies.create({ seed: props.address }).toDataURL();
});
</script>

<style lang="scss" scoped>
.navbar-desktop-account-icon {
  @apply h-6 w-6 rounded-full text-inherit xl:h-8 xl:w-8;
}
</style>
