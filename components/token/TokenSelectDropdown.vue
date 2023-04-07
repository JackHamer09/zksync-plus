<template>
  <TransitionRoot as="template" :show="isModalOpened" @after-leave="search = ''">
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
              <Combobox v-model="selectedToken">
                <!-- TODO: Refactor this to use ComboboxInput as main component but look like CommonSmallInput -->
                <CommonSmallInput v-model.trim="search" class="mb-4" placeholder="Symbol or address" autofocus>
                  <template #icon>
                    <MagnifyingGlassIcon aria-hidden="true" />
                  </template>
                </CommonSmallInput>
                <div class="h-full overflow-auto">
                  <CommonCardWithLineButtons v-if="loading">
                    <TokenBalanceLoader v-for="index in 2" :show-send-button="false" :key="index" />
                  </CommonCardWithLineButtons>
                  <CommonCardWithLineButtons v-else-if="error">
                    <CommonErrorBlock class="m-2" @try-again="emit('try-again')">
                      {{ error.message }}
                    </CommonErrorBlock>
                  </CommonCardWithLineButtons>
                  <template v-else-if="balanceGroups.length || !search">
                    <div v-for="(group, index) in balanceGroups" :key="index" class="category">
                      <TypographyCategoryLabel v-if="group.title" class="group-category-label">
                        {{ group.title }}
                      </TypographyCategoryLabel>
                      <CommonCardWithLineButtons>
                        <TokenBalance
                          v-for="item in group.balances"
                          :show-send-button="false"
                          :key="item.address"
                          v-bind="item"
                          @click="selectedToken = item"
                        />
                      </CommonCardWithLineButtons>
                    </div>
                  </template>
                  <CommonEmptyBlock v-else class="search-empty-block">
                    No tokens was found for "{{ search }}"
                    <br />
                    <span class="mt-1.5 inline-block">Make sure you are using correct zkSync network</span>
                  </CommonEmptyBlock>
                </div>
                <slot name="body-bottom" />
              </Combobox>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { Combobox, Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/vue/24/outline";

import CommonCardWithLineButtons from "@/components/common/CardWithLineButtons.vue";

import type { Balance } from "@/store/zksync/lite/wallet";
import type { PropType } from "vue";

import { groupBalancesByAmount } from "@/utils/mappers";

const props = defineProps({
  title: {
    type: String,
    default: "Choose token",
  },
  opened: {
    type: Boolean,
    default: false,
  },
  tokenAddress: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Error,
  },
  balances: {
    type: Array as PropType<Balance[]>,
    default: () => [],
  },
});

const emit = defineEmits<{
  (eventName: "update:opened", value: boolean): void;
  (eventName: "update:tokenAddress", tokenAddress?: string): void;
  (eventName: "try-again"): void;
}>();

const search = ref("");
const displayedBalances = computed(() => {
  const lowercaseSearch = search.value.toLowerCase();
  return props.balances.filter(({ address, symbol }) =>
    Object.values({ address, symbol })
      .filter((e) => typeof e === "string")
      .some((value) => value.toLowerCase().includes(lowercaseSearch))
  );
});
const balanceGroups = groupBalancesByAmount(displayedBalances);

const selectedTokenAddress = computed({
  get: () => props.tokenAddress,
  set: (value) => emit("update:tokenAddress", value),
});
const selectedToken = computed({
  get: () => {
    if (!props.balances) {
      return undefined;
    }
    return props.balances.find((e) => e.address === selectedTokenAddress.value);
  },
  set: (value) => {
    if (value) {
      selectedTokenAddress.value = value.address;
    } else {
      selectedTokenAddress.value = undefined;
    }
    closeModal();
  },
});

const isModalOpened = computed({
  get: () => props.opened,
  set: (value) => emit("update:opened", value),
});
const closeModal = () => {
  isModalOpened.value = false;
};
</script>

<style lang="scss" scoped>
.modal-card {
  @apply relative grid h-full max-h-[540px] w-full max-w-[500px] transform grid-rows-[max-content_max-content_1fr] overflow-hidden rounded-2xl bg-gray p-3 pb-4 text-left shadow-xl transition-all xs:p-5 xs:pb-6;
  @media screen and (max-height: 640px) {
    @apply max-h-[90vh];
  }
}
.category:first-child .group-category-label {
  @apply pt-0;
}
</style>
