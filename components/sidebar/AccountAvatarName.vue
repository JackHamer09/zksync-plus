<template>
  <component :is="isButton ? 'button' : 'div'" class="account-button" :class="{ 'is-button': isButton }">
    <AddressAvatar v-if="!avatar" :address="account.address!" class="account-icon" />
    <img v-else :src="avatar" class="account-icon aspect-square rounded-full" />
    <div class="account-name-container">
      <span class="account-name" :class="{ 'hidden xl:block': isButton }">
        {{ name ? name : shortenAddress(account.address!) }}
      </span>
      <button v-tooltip="'Copy address'" class="copy-button">
        <DocumentDuplicateIcon class="copy-button-icon" tabindex="-1" />
      </button>
    </div>
  </component>
</template>

<script lang="ts" setup>
import { DocumentDuplicateIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";

import { useEnsStore } from "@/store/ens";
import { useOnboardStore } from "@/store/onboard";
import { shortenAddress } from "@/utils/formatters";

defineProps({
  isButton: {
    type: Boolean,
    default: true,
  },
});

const { account } = storeToRefs(useOnboardStore());
const { name, avatar } = storeToRefs(useEnsStore());
</script>

<style lang="scss" scoped>
.account-button {
  @apply flex w-full items-center rounded-xl bg-transparent py-3 px-3 xl:px-4;
  &.is-button {
    .copy-button {
      @apply hidden;
    }
    .account-name-container {
      @apply hidden xl:grid;
    }
  }

  .account-icon {
    @apply aspect-square h-8 w-8;
  }
  .account-name-container {
    @apply ml-3 grid w-full grid-cols-[1fr_max-content] items-center justify-between;

    .account-name {
      @apply mr-auto w-full overflow-hidden text-ellipsis text-left font-medium leading-4 tracking-[-0.1px];
    }
    .copy-button {
      @apply p-1 focus:outline-none focus:ring-1;

      .copy-button-icon {
        @apply pointer-events-none h-5 w-5 text-gray-secondary;
      }
    }
  }
}
</style>
