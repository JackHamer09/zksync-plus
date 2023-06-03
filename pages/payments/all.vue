<template>
  <BackButton :fallback="{ name: 'payments' }" />
  <CommonPage title="All payments">
    <template #era>
      <AllPaymentsEra />
    </template>
    <template #lite>
      <AllPaymentsLite />
    </template>
  </CommonPage>
</template>

<script lang="ts" setup>
import AllPaymentsEra from "@/views/zksync/era/payments/All.vue";
import AllPaymentsLite from "@/views/zksync/lite/payments/All.vue";
</script>

<style lang="scss" scoped></style>
