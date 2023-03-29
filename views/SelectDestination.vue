<template>
  <div>
    <CommonBackButton @click="emit('back')" />
    <h1 class="h1">Where to send</h1>

    <slot />
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (eventName: "back"): void;
}>();
</script>

<style lang="scss" scoped></style>
