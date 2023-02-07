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
  @apply h-8 w-8 rounded-full text-inherit;
}
</style>
