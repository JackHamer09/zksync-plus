<template>
  <div class="radial-progress" :class="{ 'animate-pulse': !active }" data-progress="100">
    <div v-if="active" class="circle">
      <div class="mask full">
        <div class="fill"></div>
      </div>
      <div class="mask half">
        <div class="fill"></div>
      </div>
    </div>
    <div class="inset"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, watchEffect } from "vue";

const props = defineProps({
  duration: {
    type: Number,
    default: 10000,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (eventName: "finished"): void;
}>();

let timeout: ReturnType<typeof setTimeout> | undefined;
watchEffect(() => {
  if (props.active) {
    timeout = setTimeout(() => {
      emit("finished");
    }, props.duration);
  } else {
    clearTimeout(timeout);
  }
});

const animationDuration = computed(() => `${props.duration}ms`);

onBeforeUnmount(() => {
  clearTimeout(timeout);
});
</script>

<style lang="scss" scoped>
@use "sass:math";
.radial-progress {
  $circle-size: 20px;
  $inset-size: 14px;

  @apply relative rounded-full bg-gray-200;
  width: $circle-size;
  height: $circle-size;

  .circle {
    .mask {
      clip: rect(0px, $circle-size, $circle-size, math.div($circle-size, 2));

      &,
      .fill {
        width: $circle-size;
        height: $circle-size;
        backface-visibility: hidden;
        @apply absolute rounded-full;
      }
      &.full,
      .fill {
        animation: animateCircle linear 0s forwards;
        animation-duration: v-bind(animationDuration);
      }
      .fill {
        clip: rect(0px, math.div($circle-size, 2), $circle-size, 0px);
        @apply bg-primary-400;
      }
    }
  }
  .inset {
    @apply absolute top-1/2 left-1/2 aspect-square w-9/12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray;
  }

  @keyframes animateCircle {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(180deg);
    }
  }
}
</style>
