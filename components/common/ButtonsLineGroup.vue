<template>
  <div class="buttons-line-group">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.buttons-line-group {
  @apply grid w-full grid-flow-col-dense grid-cols-[max-content] gap-2;
}
</style>
