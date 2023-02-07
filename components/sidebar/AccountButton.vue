<template>
  <NuxtLink :to="{ name: 'account' }" class="navbar-desktop-account">
    <BlockiesImg address="Test-adress" />
    <span class="navbar-desktop-account-name">Test user</span>
  </NuxtLink>
</template>

<script lang="ts" setup>
import BlockiesImg from "@/common/BlockiesImg.vue";
</script>

<style lang="scss" scoped>
.navbar-desktop-account {
  @apply flex w-full items-center rounded-xl bg-transparent py-3 px-4 text-gray-secondary no-underline transition-colors hover:bg-gray-200;
  &.router-link-exact-active {
    @apply bg-white text-indigo-600;
  }

  .navbar-desktop-account-name {
    @apply mr-auto ml-4 hidden font-medium leading-4 tracking-[-0.1px] xl:block;
  }
}
</style>
