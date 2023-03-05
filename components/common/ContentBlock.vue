<template>
  <div class="content-block-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.content-block-container {
  @apply h-max w-full rounded-xl bg-white p-4;
}
</style>
