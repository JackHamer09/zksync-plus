import { fetchEnsAddress } from "@wagmi/core";

import type { Ref } from "vue";

export default (ensName: Ref<string>) => {
  const {
    result: ensAddress,
    inProgress: ensParseInProgress,
    error: ensParseError,
    execute: parseEns,
  } = usePromise(
    async () => {
      return await fetchEnsAddress({ name: ensName.value, chainId: 1 });
    },
    { cache: false }
  );

  return {
    ensAddress,
    ensParseInProgress,
    ensParseError,
    parseEns,
  };
};
