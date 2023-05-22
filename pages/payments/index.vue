<template>
  <CommonPage title="Payments">
    <template #era>
      <PaymentsEra />
    </template>
    <template #lite>
      <PaymentsLite />
    </template>
  </CommonPage>
</template>

<script lang="ts" setup>
import PaymentsEra from "@/views/zksync/era/payments/Index.vue";
import PaymentsLite from "@/views/zksync/lite/payments/Index.vue";
</script>

<style lang="scss" scoped></style>
