<template>
  <CommonModal class="confirm-transaction-modal" v-bind="$attrs" title="Confirm transaction">
    <div class="flex h-full flex-col overflow-auto">
      <slot />
    </div>
  </CommonModal>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.confirm-transaction-modal .modal-card {
  @apply grid h-full grid-rows-[max-content_1fr];
}
</style>
