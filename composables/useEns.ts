import { fetchEnsAddress } from "@wagmi/core";

import type { Ref } from "vue";

export default (ensName: Ref<string>) => {
  const {
    inProgress,
    error,
    result: address,
    execute: parseEns,
  } = usePromise(
    async () => {
      return await fetchEnsAddress({ name: ensName.value, chainId: 1 });
    },
    { cache: false }
  );

  return {
    inProgress,
    error,
    address,
    parseEns,
  };
};
