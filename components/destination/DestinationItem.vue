<template>
  <CommonButtonLineWithImg :as="as" class="destination-item">
    <template #image>
      <slot name="image">
        <CommonImageLoader class="destination-item-icon" :src="iconUrl" />
      </slot>
    </template>
    <template #default>
      <div class="destination-item-info">
        <div class="destination-item-label">{{ label }}</div>
        <div v-if="description" class="destination-item-description">{{ description }}</div>
      </div>
    </template>
    <template #right v-if="icon">
      <component :is="icon" class="destination-icon" aria-hidden="true" />
    </template>
  </CommonButtonLineWithImg>
</template>

<script lang="ts" setup>
import type { Component, PropType } from "vue";

defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
  },
  label: {
    type: String,
  },
  iconUrl: {
    type: String,
  },
  description: {
    type: String,
  },
  icon: {
    type: [Object, Function] as PropType<Component>,
  },
});
</script>

<style lang="scss">
.destination-item {
  .destination-item-icon {
    @apply aspect-square h-auto w-full rounded-full border bg-white transition-shadow;
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
      @apply text-sm leading-tight text-gray-secondary dark:text-neutral-400;
    }
  }
  .destination-icon {
    @apply mx-3 h-4 w-4 text-gray-secondary;
  }
}
</style>
