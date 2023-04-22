<template>
  <div class="empty-block">
    <slot />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.empty-block {
  @apply rounded-lg border border-dashed p-4 text-center leading-normal text-gray-500;
}
</style>
