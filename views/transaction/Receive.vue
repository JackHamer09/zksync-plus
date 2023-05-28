<template>
  <div>
    <CommonQrCodeStyled underline="Scan to copy address">
      <QrCode :value="address" :options="{ margin: 0, width: '100%', style: { padding: '0px' } }" />
    </CommonQrCodeStyled>
    <div class="mx-auto mt-4 max-w-sm space-y-2">
      <CommonInfoContent label="Address" :copy-content="address">
        {{ shortenAddress(address, 5) }}
      </CommonInfoContent>

      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  address: {
    type: String,
    required: true,
  },
});
</script>
