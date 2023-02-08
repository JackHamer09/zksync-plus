<template>
  <NuxtLink :to="{ name: 'account' }" class="account-button">
    <CommonBlockiesImg address="Test-adress" class="account-icon" />
    <span class="account-name">Test user</span>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.account-button {
  @apply flex w-full items-center rounded-xl bg-transparent py-3 px-3 text-gray-secondary no-underline transition-colors hover:bg-gray-200 xl:px-4;
  &.router-link-exact-active {
    @apply bg-white text-indigo-600;
  }
  .account-icon {
    @apply h-8 w-8 rounded-full md:block;
  }
  .account-name {
    @apply mr-auto ml-4 hidden font-medium leading-4 tracking-[-0.1px] xl:block;
  }
}
</style>
