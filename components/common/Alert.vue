<template>
  <div class="alert-container" :class="`variant-${variant}`">
    <div v-if="icon">
      <component :is="icon" class="alert-icon" aria-hidden="true" />
    </div>
    <div class="alert-body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from "vue";
import type { PropType } from "vue";

defineProps({
  variant: {
    type: String as PropType<"info" | "error">,
  },
  icon: {
    type: [Object, Function] as PropType<Component>,
  },
});
</script>

<style lang="scss">
.alert-container {
  @apply grid grid-cols-[1.25rem_1fr] gap-3 rounded-md p-4;
  &.variant- {
    &info {
      @apply bg-primary-100 text-primary-700;

      .alert-body {
        .alert-link {
          @apply hover:text-primary-600;
        }
      }
    }
    &error {
      @apply bg-red-100 text-red-700;

      .alert-body {
        .alert-link {
          @apply hover:text-red-600;
        }
      }
    }
  }

  .alert-icon {
    @apply h-5 w-5;
  }
  .alert-body {
    @apply flex-1 items-center text-sm xs:flex xs:justify-between;

    .alert-link {
      @apply mt-2 flex items-center whitespace-nowrap  font-medium underline underline-offset-2 transition-colors xs:ml-6 xs:mt-0;
    }
  }
}
</style>
