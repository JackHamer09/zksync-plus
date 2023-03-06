import { getDefaultRestProvider } from "zksync";

import usePromise from "@/composables/usePromise";

import type { RestProvider } from "zksync";
import type { Network as ZkSyncNetworkName, ExtendedTokens as ZkSyncTokens } from "zksync/build/types";

export default (networkName: ZkSyncNetworkName) => {
  const zkSyncNetworkName = ref<ZkSyncNetworkName>(networkName);

  const {
    result: provider,
    inProgress: providerRequestInProgress,
    error: providerRequestError,
    execute: requestProvider,
  } = usePromise<RestProvider>(() => getDefaultRestProvider(zkSyncNetworkName.value));

  const {
    result: tokens,
    inProgress: tokensRequestInProgress,
    error: tokensRequestError,
    execute: requestTokens,
  } = usePromise<ZkSyncTokens>(async () => {
    await requestProvider();
    if (!provider.value) throw new Error("Provider is not available");
    return await provider.value.getTokens();
  });

  const changeZkSyncNetwork = async (networkName: ZkSyncNetworkName) => {
    zkSyncNetworkName.value = networkName;
    const providerPromise = requestProvider({ force: true });

    if (tokens.value || tokensRequestInProgress.value) {
      await requestTokens({ force: true });
    }
    await providerPromise;
  };

  return {
    provider,
    providerRequestInProgress,
    providerRequestError,
    requestProvider,
    changeZkSyncNetwork,

    tokens,
    tokensRequestInProgress,
    tokensRequestError,
    requestTokens,
  };
};
