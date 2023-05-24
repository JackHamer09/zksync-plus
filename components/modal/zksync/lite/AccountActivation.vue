<template>
  <CommonModal v-bind="$attrs" title="Account activation">
    <p class="leading-normal">
      The account activation is a <span class="font-medium">one-time</span> procedure to register your account with
      zkSync Lite. It includes a <span class="font-medium">one-time fee</span> that will only apply to your first zkSync
      Lite transaction. You can read more about it in the
      <a class="link inline-flex items-center" :href="LITE_ACCOUNT_ACTIVATION" target="_blank">
        official documentation
        <ArrowUpRightIcon class="ml-1 mt-0.5 h-3.5 w-3.5" />
      </a>
    </p>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";

import { LITE_ACCOUNT_ACTIVATION } from "@/utils/doc-links";
</script>
