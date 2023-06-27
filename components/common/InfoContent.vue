<template>
  <div class="w-full rounded-xl bg-white p-3 dark:bg-neutral-900">
    <div class="flex justify-between">
      <div class="text-sm text-gray-secondary dark:text-neutral-400">{{ label }}</div>
      <button v-if="content" class="text-sm font-medium text-primary-400 dark:text-primary-500" @click="copy">
        <template v-if="!copied">
          <DocumentDuplicateIcon class="relative -top-px inline-block h-4 w-4" aria-hidden="true" />
          Copy
        </template>
        <template v-else>Copied!</template>
      </button>
    </div>
    <div class="mt-2">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { DocumentDuplicateIcon } from "@heroicons/vue/24/outline";

import useCopy from "@/composables/useCopy";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  copyContent: {
    type: String,
  },
});

const content = computed(() => props.copyContent || "");
const { copy, copied } = useCopy(content);
</script>

<style lang="scss"></style>
