<template>
  <Web3Avatar :address="address" />
</template>

<script lang="ts" setup>
import Web3Avatar from "web3-avatar-vue";

defineProps({
  address: {
    type: String,
    required: true,
  },
});
</script>
