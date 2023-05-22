<template>
  <component :is="as" class="small-input-container" :class="{ focused }">
    <div v-if="$slots.icon" class="small-input-icon-container">
      <slot name="icon" />
    </div>
    <input
      ref="inputElement"
      v-model="inputted"
      class="small-input-field"
      :placeholder="placeholder"
      :type="type"
      spellcheck="false"
    />
    <transition v-bind="TransitionOpacity()">
      <button v-if="inputted" class="small-input-clear-button" type="button" @click="inputted = ''">
        <XMarkIcon class="small-input-clear-button-icon" aria-hidden="true" />
      </button>
    </transition>
  </component>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useFocus } from "@vueuse/core";

import type { Component, PropType } from "vue";

import { TransitionOpacity } from "@/utils/transitions";

const props = defineProps({
  as: {
    type: [String, Object] as PropType<string | Component>,
    default: "div",
  },
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (eventName: "update:modelValue", value: string): void;
}>();

const inputElement = ref<HTMLInputElement | null>(null);
const { focused } = useFocus(inputElement, { initialValue: !!props.autofocus });

const inputted = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});
</script>

<style lang="scss">
.small-input-container {
  @apply flex h-9 w-full items-center rounded-[10px] bg-gray-input p-1.5 transition-colors;
  &.focused,
  &:hover {
    @apply bg-gray-input-focus;

    .small-input-clear-button {
      @apply bg-gray-400;
    }
  }

  .small-input-icon-container {
    @apply flex h-5 w-5 items-center justify-center text-gray-secondary;

    svg {
      @apply block aspect-square h-full w-full;
    }
  }
  .small-input-field {
    @apply mx-1.5 w-full border-none bg-transparent outline-none placeholder:text-gray-secondary;
  }
  .small-input-clear-button {
    @apply block aspect-square h-6 w-6 self-end rounded-full bg-gray-300 p-1 transition-all;
    &:hover {
      @apply bg-gray-500;
    }

    .small-input-clear-button-icon {
      @apply h-full w-full text-white;
    }
  }
}
</style>
