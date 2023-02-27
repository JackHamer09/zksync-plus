<template>
  <div class="meta-mask-fox" ref="el"></div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

import ModelViewer from "@metamask/logo";
import { useResizeObserver } from "@vueuse/core";

import type { MaybeElementRef } from "@vueuse/core";

const props = defineProps({
  svgClasses: {
    type: String,
    default: "",
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const viewer = ModelViewer({
  pxNotRatio: true,
  followMouse: !props.disabled,
  followMotion: !props.disabled,
});

const el = ref(null as HTMLDivElement | null);

useResizeObserver(el as MaybeElementRef, () => {
  viewer.renderCurrentScene();
});

onMounted(() => {
  viewer.container.classList.add(...props.svgClasses.split(" "));
  el.value?.appendChild(viewer.container);
});

onBeforeUnmount(() => {
  viewer.stopAnimation();
});
</script>

<style lang="scss">
.meta-mask-fox {
  svg {
    height: 100%;
    width: auto;
  }
}
</style>
