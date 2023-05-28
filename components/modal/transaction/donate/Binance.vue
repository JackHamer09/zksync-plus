<template>
  <CommonModal v-bind="$attrs" title="Donate on Binance">
    <CommonQrCodeStyled underline="Scan via the Binance App">
      <img src="/img/donate-binance-qr.png" alt="Donate with Binance QR" />
    </CommonQrCodeStyled>
    <div class="mx-auto mt-4 max-w-sm space-y-2">
      <CommonInfoContent label="Pay ID" copy-content="219962212">219962212</CommonInfoContent>
      <CommonInfoContent label="Nickname" copy-content="JackHamer">JackHamer</CommonInfoContent>
    </div>
  </CommonModal>
</template>

<script lang="ts" setup></script>
