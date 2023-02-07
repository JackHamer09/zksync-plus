<template>
  <div class="login-page">
    <h1 class="h1 mb-2 text-center">Log in to zkSync Plus</h1>
    <p class="login-description">Connect your Ethereum wallet to experience zkSync Plus</p>
  </div>
</template>

<script lang="ts" setup>
import { definePageMeta } from "#imports";

definePageMeta({
  layout: "login",
});
</script>

<style lang="scss" scoped>
.login-page {
  .login-description {
    @apply whitespace-nowrap text-center text-sm text-gray-secondary;
  }
}
</style>
