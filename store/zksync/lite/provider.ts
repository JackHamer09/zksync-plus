import { defineStore, storeToRefs } from "pinia";
import { getDefaultRestProvider } from "zksync";

import type { EthereumNetworkName } from "@/store/network";
import type { RestProvider } from "zksync";
import type { Network as ZkSyncNetworkName } from "zksync/build/types";

import { useNetworkStore } from "@/store/network";
import { useLiteTokensStore } from "@/store/zksync/lite/tokens";

export const useLiteProviderStore = defineStore("liteProvider", () => {
  const liteTokens = useLiteTokensStore();
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  const {
    inProgress: providerRequestInProgress,
    error: providerRequestError,
    execute: requestProvider,
    reset: resetProvider,
  } = usePromise<RestProvider>(() =>
    getDefaultRestProvider(selectedEthereumNetwork.value.network as ZkSyncNetworkName)
  );

  const changeZkSyncNetwork = async (networkName: ZkSyncNetworkName) => {
    console.warn("changeZkSyncNetwork", networkName); // TEMP
    resetProvider();
    await requestProvider();
    liteTokens.resetTokens();
    await liteTokens.requestTokens();
  };

  watch(selectedEthereumNetwork, async (network) => {
    await changeZkSyncNetwork(network.network as EthereumNetworkName);
  });

  return {
    providerRequestInProgress,
    providerRequestError,
    requestProvider,
    changeZkSyncNetwork,
  };
});
