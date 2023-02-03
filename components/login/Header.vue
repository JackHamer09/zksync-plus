<template>
  <div class="login-header">
    <img class="login-header-logo" src="/logo.svg" alt="zkSync Plus" />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.login-header {
  @apply mx-auto my-7;

  @media screen and (min-width: 720px) {
    @apply mx-8;
  }

  .login-header-logo {
    @apply block h-5 w-auto max-w-full;
  }
}
</style>
