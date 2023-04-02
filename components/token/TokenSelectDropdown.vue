<template>
  <div v-if="isModalOpened" class="modal-container">
    <OnClickOutside @trigger="closeModal" role="document">
      <div
        ref="modal"
        class="modal-card"
        aria-hidden="true"
        aria-modal="true"
        role="dialog"
        tabindex="-1"
        @keydown.esc="closeModal"
      >
        <div class="modal-card-header">
          <div class="modal-title">token_dropdown.choose_coin</div>
          <button @click="closeModal">
            <XMarkIcon class="h-5 w-5 text-neutral-700" aria-hidden="true" />
          </button>
        </div>
        <div>
          <Combobox v-model="selectedToken">
            <div class="px-4 pb-2">
              <div class="modal-input-container">
                <!-- <div class="search-icon-container">
                  <SearchIcon class="h-5 w-5 text-neutral-700" aria-hidden="true" />
                </div> -->
                <ComboboxInput
                  id="search"
                  type="text"
                  class="search-input"
                  :placeholder="'token_dropdown.placeholder'"
                  @change="search = $event.target.value"
                >
                </ComboboxInput>
              </div>
            </div>
            <div class="modal-list-title">token_dropdown.your_assets</div>
            <ComboboxOptions static class="modal-search-options-container">
              <ComboboxOption v-for="item in displayedBalances" :key="item.symbol" :value="item" as="template">
                <!-- v-slot="{ active }" -->
                <!-- <li class="modal-list-item" :class="[active && 'bg-black/[.05]']">
                  <TokenLabel :token="item" />
                  <div v-if="item.value" class="flex flex-col items-end">
                    <div class="modal-list-label">{{ item.value }}</div>
                    <p v-if="item.price === null" class="modal-list-price-error">token_dropdown.token_unknown_price</p>
                    <p v-else-if="item.price" class="modal-list-light-text">~${{ item.price }}</p>
                  </div>
                  <div v-else class="custom-token-balance">0.00</div>
                </li> -->
              </ComboboxOption>
            </ComboboxOptions>
          </Combobox>
        </div>
      </div>
    </OnClickOutside>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";

import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { OnClickOutside } from "@vueuse/components";
import { createFocusTrap } from "focus-trap";

import type { Balance } from "@/store/zksync/lite/wallet";
import type { FocusTrap } from "focus-trap";
import type { PropType } from "vue";

const props = defineProps({
  opened: {
    type: Boolean,
    default: false,
  },
  tokenAddress: {
    type: String,
  },
  pending: {
    type: Boolean,
    default: true,
  },
  balances: {
    type: Array as PropType<Balance[]>,
    default: () => [],
  },
});

const emit = defineEmits<{
  (eventName: "update:opened", value: boolean): void;
  (eventName: "update:tokenAddress", tokenAddress?: string): void;
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

const selectedTokenAddress = computed({
  get: () => props.tokenAddress,
  set: (value) => emit("update:tokenAddress", value),
});
const selectedToken = computed(() => {
  if (!props.balances) {
    return undefined;
  }
  return props.balances.find((e) => e.address === selectedTokenAddress.value);
});

const modalEl = ref<HTMLElement | undefined>();
const isModalOpened = computed({
  get: () => props.opened,
  set: (value) => emit("update:opened", value),
});
let trap: FocusTrap | null;
watch(isModalOpened, async (opened) => {
  search.value = "";
  await nextTick(async () => {
    if (opened && modalEl.value) {
      trap = createFocusTrap(modalEl.value, {
        initialFocus: document.getElementById("search") ?? false,
        escapeDeactivates: true,
        clickOutsideDeactivates: true,
      }) as FocusTrap;
      trap?.activate();
    } else {
      trap?.deactivate();
      trap = null;
    }
  });
});
const closeModal = () => {
  isModalOpened.value = false;
};
</script>
<style lang="scss" scoped>
.option-button {
  @apply relative inline-flex items-center rounded-md bg-white px-2.5 py-1 ring-2 ring-inset ring-neutral-700 ring-opacity-5 hover:bg-neutral-100 focus:outline-none focus:ring-2
  focus:ring-primary-500 disabled:cursor-not-allowed disabled:hover:bg-white;
}
.token-balance-value {
  @apply relative inline-flex items-center text-neutral-700;
  .selected-custom-token {
    @apply h-3 w-3 rounded-full;
  }
}
.arrow-icon-container {
  @apply relative inline-flex items-center rounded-l-none rounded-r-md text-sm;
}

.token-balance-text {
  @apply mx-1.5 w-max overflow-hidden text-ellipsis text-sm;
}
.modal-container {
  @apply fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.4)];
  .modal-card {
    @apply w-[300px] overflow-y-hidden rounded-lg bg-white;
    .modal-title {
      @apply text-base text-neutral-700;
    }

    .modal-card-header {
      @apply flex justify-between p-4;
    }

    .empty-options-container {
      @apply flex flex-col items-center justify-center;
    }

    .modal-list-title {
      @apply px-4 py-2 text-xs text-neutral-700;
    }

    .modal-list-label {
      @apply text-sm text-neutral-700;
    }

    .modal-search-options-container {
      @apply h-[240px] scroll-py-2 overflow-y-auto py-2 text-sm text-neutral-700;
    }
    .modal-input-container {
      @apply relative mt-1 flex items-center;
    }

    .modal-list-light-text {
      @apply text-xs capitalize text-neutral-400;
    }
    .modal-list-price-error {
      @apply text-error-500 text-xs;
    }
    .custom-token-balance {
      @apply flex items-center tracking-tighter text-neutral-400;
    }
    .modal-list-item {
      @apply flex cursor-pointer justify-between py-2 px-4 hover:bg-black/[.05];
    }
    .search-icon-container {
      @apply pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3;
    }
    .search-input {
      @apply block w-full rounded-md border-neutral-300 px-4 pb-2 pl-10 pr-2 text-neutral-700 placeholder-neutral-400 shadow-sm placeholder:text-xs focus:border-primary-500
      focus:ring-primary-500;
    }
  }
}
.token-balance-loading {
  @apply inline-flex h-5 w-5 animate-spin text-neutral-700;
}
</style>
