import { defineStore, storeToRefs } from "pinia";

import useProvider from "@/composables/zksync/lite/useProvider";

import type { EthereumNetworkName } from "@/store/network";

import { useNetworkStore } from "@/store/network";

const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

export const useLiteProviderStore = defineStore("liteProvider", () => {
  const {
    providerRequestInProgress,
    providerRequestError,
    requestProvider,
    changeZkSyncNetwork,

    tokens,
    tokensRequestInProgress,
    tokensRequestError,
    requestTokens,
  } = useProvider(selectedEthereumNetwork.value.name.toLowerCase() as EthereumNetworkName);

  watch(selectedEthereumNetwork, async (network) => {
    await changeZkSyncNetwork(network.name.toLowerCase() as EthereumNetworkName);
  });

  return {
    providerRequestInProgress,
    providerRequestError,
    requestProvider,
    changeZkSyncNetwork,

    tokens,
    tokensRequestInProgress,
    tokensRequestError,
    requestTokens,
  };
});
