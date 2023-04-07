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

  .tippy-box {
    @apply rounded-lg text-sm;
    &[data-theme~="light"] {
      @apply bg-white bg-opacity-70 shadow backdrop-blur;

      &[data-placement^="top"] > .tippy-arrow:before {
        border-top-color: rgba(255, 255, 255, 0.7);
        bottom: -8px;
      }
      &[data-placement^="bottom"] > .tippy-arrow:before {
        border-bottom-color: rgba(255, 255, 255, 0.7);
        top: -7px;
      }
    }
  }
}
</style>
