<template>
  <div class="buttons-line-group">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.buttons-line-group {
  @apply flex w-full space-x-2 overflow-x-auto;
}
</style>
