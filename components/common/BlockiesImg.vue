<template>
  <img :src="imgSrc" alt="" />
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
