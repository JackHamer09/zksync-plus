<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup></script>

<style lang="scss">
html,
body {
  @apply min-h-full w-full bg-[#f7f7f7] font-sans leading-[1.15] antialiased;
  -webkit-text-size-adjust: 100%;

  .link {
    @apply font-medium text-primary-400 transition-colors;
    &:enabled:not([aria-disabled="true"]) {
      @apply hover:text-primary-300;
    }
  }
}
</style>
