<template>
  <button type="button" class="label-button">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.label-button {
  @apply block text-sm font-medium text-primary-400 transition-colors;
  &:enabled:not([aria-disabled="true"]) {
    @apply hover:text-primary-300;
  }
}
</style>
