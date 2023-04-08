<template>
  <TransitionRoot as="template" :show="isModalOpened" @after-leave="afterLeave">
    <Dialog as="div" class="relative z-10" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              ref="modal"
              class="modal-card"
              aria-hidden="true"
              aria-modal="true"
              role="dialog"
              tabindex="-1"
              @trigger="closeModal"
              @keydown.esc="closeModal"
            >
              <div class="mb-4 flex items-center justify-between">
                <DialogTitle as="div" class="h2 py-0">{{ title }}</DialogTitle>
                <button @click="closeModal">
                  <XMarkIcon class="h-6 w-6 text-neutral-700" aria-hidden="true" />
                </button>
              </div>
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  opened: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (eventName: "update:opened", value: boolean): void;
  (eventName: "after-leave", value: boolean): void;
}>();

const isModalOpened = computed({
  get: () => props.opened,
  set: (value) => emit("update:opened", value),
});
const closeModal = () => {
  isModalOpened.value = false;
};
const afterLeave = () => {
  emit("after-leave", false);
};
</script>

<style lang="scss" scoped>
.modal-card {
  @apply relative max-h-[540px] w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-gray p-3 text-left shadow-xl transition-all xs:p-5 xs:pb-6;
  @media screen and (max-height: 640px) {
    @apply max-h-[90vh];
  }
}
</style>
