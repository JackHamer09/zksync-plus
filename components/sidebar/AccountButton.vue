<template>
  <NuxtLink :to="{ name: 'account' }" class="account-button">
    <Web3Avatar :address="address" class="account-icon" />
    <span class="account-name">Test user</span>
  </NuxtLink>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import Web3Avatar from "web3-avatar-vue";

const address = ref("0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044");
</script>

<style lang="scss" scoped>
.account-button {
  @apply flex w-full items-center rounded-xl bg-transparent py-3 px-3 text-gray-secondary no-underline transition-colors hover:bg-gray-200 xl:px-4;
  &.router-link-exact-active {
    @apply bg-white text-indigo-600;
  }
  .account-icon {
    @apply h-8 w-8;
  }
  .account-name {
    @apply mr-auto ml-4 hidden font-medium leading-4 tracking-[-0.1px] xl:block;
  }
}
</style>
