<template>
  <CommonTabs v-model="version" :options="options" />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import type { TabsOption } from "./common/Tabs.vue";

import { usePreferencesStore } from "@/store/preferences";

const preferencesStore = usePreferencesStore();
const { version } = storeToRefs(preferencesStore);

const options: TabsOption[] = [
  {
    label: "zkSync Era∎",
    key: "era",
  },
  {
    label: "zkSync Lite",
    key: "lite",
  },
];
</script>

<style lang="scss" scoped></style>
