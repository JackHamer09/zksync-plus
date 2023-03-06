<template>
  <button type="button" class="default-button">
    <span v-if="$slots.icon" class="icon-container">
      <slot name="icon" />
    </span>
    <slot />
  </button>
</template>

<style lang="scss">
.default-button {
  @apply flex h-[2.25rem] w-max items-center justify-center rounded-[10px] bg-primary-100/50 px-4 text-sm font-medium text-primary-400 transition-colors;
  &:enabled:not([aria-disabled="true"]) {
    @apply hover:bg-primary-100/75;
  }
  .icon-container {
    @apply -ml-0.5 mr-2 inline-flex items-center;

    svg {
      @apply block h-4 w-4;
    }
  }
}
</style>
