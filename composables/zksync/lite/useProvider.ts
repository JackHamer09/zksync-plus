import { getDefaultRestProvider } from "zksync";

import usePromise from "@/composables/usePromise";

import type { RestProvider } from "zksync";
import type { Network as ZkSyncNetworkName, ExtendedTokens as ZkSyncTokens } from "zksync/build/types";

export default (networkName: ZkSyncNetworkName) => {
  const zkSyncNetworkName = ref<ZkSyncNetworkName>(networkName);

  const {
    inProgress: providerRequestInProgress,
    error: providerRequestError,
    execute: requestProvider,
  } = usePromise<RestProvider>(() => getDefaultRestProvider(zkSyncNetworkName.value));

  const {
    result: tokens,
    inProgress: tokensRequestInProgress,
    error: tokensRequestError,
    execute: requestTokens,
    clear: clearTokens,
  } = usePromise<ZkSyncTokens>(async () => {
    const provider = await requestProvider();
    if (!provider) throw new Error("Provider is not available");
    return await provider.getTokens();
  });

  const changeZkSyncNetwork = async (networkName: ZkSyncNetworkName) => {
    zkSyncNetworkName.value = networkName;
    clearTokens();
    await requestProvider({ force: true });
    await requestTokens();
  };

  return {
    providerRequestInProgress,
    providerRequestError,
    requestProvider,

    tokens,
    tokensRequestInProgress,
    tokensRequestError,
    requestTokens,

    changeZkSyncNetwork,
  };
};
