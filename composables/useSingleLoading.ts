import { ref, watch } from "vue";

import type { Ref } from "vue";

export default (loading: Ref<boolean>) => {
  const loaded = ref(false);

  watch(
    loading,
    (value, oldValue) => {
      if (value === false && oldValue === true) {
        loaded.value = true;
      }
    },
    { immediate: true }
  );

  const reset = () => {
    loaded.value = false;
  };

  return {
    loading: computed(() => {
      if (loaded.value) {
        return false;
      }
      return loading.value;
    }),
    reset,
  };
};
