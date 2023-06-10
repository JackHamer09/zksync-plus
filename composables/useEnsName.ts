import { watch } from "vue";

import { fetchEnsAddress } from "@wagmi/core";

import type { Ref } from "vue";

export default (ensName: Ref<string>) => {
  watch(ensName, async (newValue) => {
    address.value = undefined;
    if (newValue.endsWith(".eth")) {
      await parseEns();
    }
  });

  const {
    result: address,
    inProgress,
    error,
    execute: parseEns,
  } = usePromise(
    async () => {
      return await fetchEnsAddress({ name: ensName.value, chainId: 1 });
    },
    { cache: false }
  );

  return {
    address,
    inProgress,
    error,
    parseEns,
  };
};
