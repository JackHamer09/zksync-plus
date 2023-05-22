<template>
  <CommonPage title="Home">
    <template #era>
      <HomeEra />
    </template>
    <template #lite>
      <HomeLite />
    </template>
  </CommonPage>
</template>

<script lang="ts" setup>
import HomeEra from "@/views/zksync/era/Home.vue";
import HomeLite from "@/views/zksync/lite/Home.vue";
</script>

<style lang="scss" scoped></style>
