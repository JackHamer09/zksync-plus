<template>
  <div>
    <h1 class="h1">Payments</h1>
    <CommonBadgeTabs class="mb-4" />

    <CommonContentBlock>
      <CommonButtonsLineGroup class="mb-4">
        <CommonButton as="RouterLink" :to="{ name: 'transaction-zksync-lite' }">
          <template #icon>
            <PaperAirplaneIcon aria-hidden="true" />
          </template>
          <template #default>Send</template>
        </CommonButton>
      </CommonButtonsLineGroup>
    </CommonContentBlock>
  </div>
</template>

<script lang="ts" setup>
import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
</script>

<style lang="scss" scoped></style>
