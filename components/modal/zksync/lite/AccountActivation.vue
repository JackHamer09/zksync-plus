<template>
  <CommonModal v-bind="$attrs" title="Account activation">
    <div class="flex flex-col justify-between">
      <p class="leading-normal">
        The account activation is a <span class="font-medium">one-time</span> procedure to register your account with
        zkSync Lite. It includes a <span class="font-medium">one-time fee</span> that will only apply to your first
        zkSync Lite transaction. You can read more about it in the
        <a
          class="link inline-flex items-center"
          href="https://docs.zksync.io/userdocs/faq/#what-is-the-account-activation-fee"
          target="_blank"
        >
          official documentation
          <ArrowUpRightIcon class="ml-1 mt-0.5 h-3.5 w-3.5" />
        </a>
      </p>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup>
import { ArrowUpRightIcon } from "@heroicons/vue/24/outline";
</script>
