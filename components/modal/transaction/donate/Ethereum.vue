<template>
  <CommonModal v-bind="$attrs" title="Donate on Ethereum">
    <Receive address="0xa1cf087DB965Ab02Fb3CFaCe1f5c63935815f044">
      <CommonInfoContent label="ENS name" copy-content="JackHamer.eth">JackHamer.eth</CommonInfoContent>
    </Receive>
  </CommonModal>
</template>

<script lang="ts" setup>
import Receive from "@/views/transaction/Receive.vue";
</script>
