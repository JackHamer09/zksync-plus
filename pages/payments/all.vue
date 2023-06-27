<template>
  <BackButton :fallback="{ name: 'transactions' }" />
  <CommonPage title="All transactions">
    <template #era>
      <AllTransactionsEra />
    </template>
    <template #lite>
      <AllTransactionsLite />
    </template>
  </CommonPage>
</template>

<script lang="ts" setup>
import AllTransactionsEra from "@/views/zksync/era/transactions/All.vue";
import AllTransactionsLite from "@/views/zksync/lite/transactions/All.vue";
</script>

<style lang="scss" scoped></style>
