<template>
  <BackButton :fallback="{ name: 'index' }" />
  <CommonPage title="Balances">
    <template #era>
      <BalancesEra />
    </template>
    <template #lite>
      <BalancesLite />
    </template>
  </CommonPage>
</template>

<script lang="ts" setup>
import BalancesEra from "@/views/zksync/era/Balances.vue";
import BalancesLite from "@/views/zksync/lite/Balances.vue";
</script>

<style lang="scss" scoped></style>
