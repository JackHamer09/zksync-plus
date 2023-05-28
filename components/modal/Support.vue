<template>
  <CommonModal v-bind="$attrs" title="Support the project ❤️" @after-leave="generateRandomText" @close="closeModal">
    <p class="leading-normal">
      Hey there, <a class="link" href="https://github.com/JackHamer09" target="_blank">Jack</a> here, the one-man-show
      behind zkSync Plus. Excited to have you around!
    </p>
    <div class="mt-2 leading-normal">
      Want to help out?
      <ol class="list-disc pl-4">
        <li>
          <span class="font-medium">Contribute:</span> Head to
          <a class="link" href="https://github.com/JackHamer09/zksync-plus" target="_blank">GitHub page</a>, tinker with
          the code, and help make zkSync Plus better!
        </li>
        <li>
          <span class="font-medium">Donate:</span> Loving the project? Even a fraction of a token as a thank-you would
          be absolutely epic!
        </li>
      </ol>
    </div>
    <p class="pt-2 text-sm leading-tight">
      Regardless of how you choose to help, just know that I appreciate you for being here &lt;3
    </p>

    <CommonButton
      class="mx-auto mt-4"
      variant="primary-solid"
      as="RouterLink"
      :to="{ name: 'transaction-donate' }"
      @click="closeModal"
    >
      <template #icon>
        <HeartIcon aria-hidden="true" />
      </template>
      <template #default>{{ buttonText }}</template>
    </CommonButton>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import { HeartIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits<{
  (eventName: "update:opened", state: boolean): void;
}>();
const closeModal = () => emit("update:opened", false);

function getRandomTextVariant(): string {
  const textVariants = ["Donate a Byte!", "Crypto High-Five!", "Chip In Crypto!"];
  const randomIndex = Math.floor(Math.random() * textVariants.length);
  return textVariants[randomIndex];
}
const buttonText = ref(getRandomTextVariant());
const generateRandomText = () => (buttonText.value = getRandomTextVariant());
</script>
