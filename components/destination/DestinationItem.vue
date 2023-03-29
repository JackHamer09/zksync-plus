<template>
  <CommonLineButton class="destination-item">
    <CommonImageLoader class="destination-item-icon" :src="iconUrl" />
    <div class="destination-item-info">
      <div class="destination-item-label">{{ label }}</div>
      <div v-if="description" class="destination-item-description">{{ description }}</div>
    </div>
  </CommonLineButton>
</template>

<script lang="ts" setup>
defineProps({
  label: {
    type: String,
  },
  iconUrl: {
    type: String,
  },
  description: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.destination-item {
  @apply grid grid-cols-[40px_1fr] items-center gap-4;
  &:hover .destination-item-icon {
    @apply shadow-sm;
  }

  .destination-item-icon {
    @apply aspect-square h-full w-auto rounded-full bg-gray transition-shadow;
  }
  .destination-item-info {
    @apply flex w-full flex-col justify-between overflow-hidden whitespace-nowrap;

    .destination-item-label,
    .destination-item-description {
      @apply overflow-hidden overflow-ellipsis;
    }
    .destination-item-label {
      @apply font-medium leading-relaxed;
    }
    .destination-item-description {
      @apply text-sm leading-tight text-gray-secondary;
    }
  }
}
</style>
