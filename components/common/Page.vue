<template>
  <div>
    <CommonBackButton v-if="backButtonLocation" as="RouterLink" :to="backButtonLocation" />
    <CommonBackButton v-else-if="backButtonCallback" @click="backButtonCallback()" />

    <h1 class="h1">{{ title }}</h1>
    <VersionTabsStatic class="mb-4" />

    <slot name="era" v-if="version === 'era'" />
    <slot name="lite" v-else-if="version === 'lite'" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";

import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";

import { usePreferencesStore } from "@/store/preferences";

defineProps({
  title: {
    type: String,
    required: true,
  },
  backButtonLocation: {
    type: Object as PropType<RouteLocationRaw>,
  },
  backButtonCallback: {
    type: Function,
  },
});

const { version } = storeToRefs(usePreferencesStore());
</script>

<style lang="scss" scoped></style>
