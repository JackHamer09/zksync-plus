<template>
  <CommonModal v-bind="$attrs" title="" @after-leave="confirmRemove = false">
    <template #animation v-if="contact">
      <div class="flex w-full flex-col items-center">
        <AddressAvatar :address="contact.address" class="h-20 w-20" />
        <div class="h1 mt-2 w-full overflow-hidden text-ellipsis whitespace-nowrap p-0 text-center">
          {{ contact.name }}
        </div>
      </div>
    </template>
    <template #default v-if="contact">
      <TypographyCategoryLabel>Information</TypographyCategoryLabel>
      <div class="w-full rounded-xl bg-white p-3">
        <div class="flex justify-between">
          <div class="text-sm font-medium text-gray-secondary">Address</div>
          <button class="text-sm font-medium text-primary-400" @click="copyAddress">
            <template v-if="!copied">
              <DocumentDuplicateIcon class="relative -top-px inline-block h-4 w-4" aria-hidden="true" />
              Copy
            </template>
            <template v-else>Copied!</template>
          </button>
        </div>
        <div class="mt-2">{{ shortenAddress(contact.address, 5) }}</div>
      </div>

      <TypographyCategoryLabel>Actions</TypographyCategoryLabel>
      <CommonButtonsLineGroup>
        <CommonButton as="RouterLink" :to="{ name: 'transaction-send', query: { address: contact.address } }">
          <template #icon>
            <PaperAirplaneIcon aria-hidden="true" />
          </template>
          <template #default>Send</template>
        </CommonButton>
        <CommonButton @click="emit('edit')">
          <template #icon>
            <PencilIcon aria-hidden="true" />
          </template>
          <template #default>Edit</template>
        </CommonButton>
        <CommonButton @click="confirmRemove ? removeContact() : (confirmRemove = true)">
          <template #icon>
            <TrashIcon aria-hidden="true" />
          </template>
          <template #default>{{ !confirmRemove ? "Remove" : "Are you sure?" }}</template>
        </CommonButton>
      </CommonButtonsLineGroup>
    </template>
  </CommonModal>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { DocumentDuplicateIcon, PaperAirplaneIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { useClipboard, useThrottleFn } from "@vueuse/core";

import type { Contact } from "@/store/contacts";
import type { PropType } from "vue";

import { shortenAddress } from "@/utils/formatters";

const props = defineProps({
  contact: {
    type: Object as PropType<Contact | undefined>,
  },
});
const emit = defineEmits<{
  (eventName: "remove"): void;
  (eventName: "edit"): void;
}>();

const confirmRemove = ref(false);
const removeContact = () => {
  emit("remove");
};

const contactAddress = computed(() => props.contact?.address || "");
const { copy, copied: isCopied } = useClipboard({
  source: contactAddress,
  copiedDuring: 1000,
});
const tooltipShownViaLegacyCopy = ref(false);
const showLegacyCopyTooltip = useThrottleFn(() => {
  tooltipShownViaLegacyCopy.value = true;
  setTimeout(() => {
    tooltipShownViaLegacyCopy.value = false;
  }, 1000);
}, 1000);
const copied = computed(() => isCopied.value || tooltipShownViaLegacyCopy.value);

async function copyAddress() {
  try {
    await copy();
  } catch (error) {
    legacyCopy();
    showLegacyCopyTooltip();
  }
}
function legacyCopy() {
  const ta = document.createElement("textarea");
  ta.value = contactAddress.value;
  ta.style.position = "absolute";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
}
</script>
