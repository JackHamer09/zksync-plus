<template>
  <CommonModal v-bind="$attrs" title="Withdraw to exchange" @after-leave="checked = false">
    <p class="leading-normal">
      When withdrawing to an exchange account, please make sure that your exchange supports transfers from smart
      contracts. Otherwise, this can result in <span class="font-medium text-red-600">loss of funds</span>
    </p>

    <div class="mt-3 flex items-start">
      <div class="flex h-6 items-center">
        <input
          v-model="checked"
          id="risc"
          aria-describedby="risc-description"
          name="risc"
          type="checkbox"
          class="h-5 w-5 rounded border-gray-400 text-primary-600 focus:ring-primary-600"
          @keyup.enter="checked = !checked"
        />
      </div>
      <label id="risc-description" for="risc" class="ml-3 text-sm font-medium leading-6">
        I understand the risks of losing funds
      </label>
    </div>

    <CommonButton
      :as="checked ? 'RouterLink' : 'Button'"
      :to="buttonLocation"
      variant="primary-solid"
      :disabled="!checked"
      class="mx-auto mt-5"
    >
      Proceed
    </CommonButton>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

defineProps({
  buttonLocation: {
    type: Object as PropType<RouteLocationRaw>,
    required: true,
  },
});

const checked = ref(false);
</script>
