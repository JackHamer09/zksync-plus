import { defineStore, storeToRefs } from "pinia";
import { getDefaultRestProvider } from "zksync";

import type { RestProvider } from "zksync";
import type { Network as ZkSyncNetworkName } from "zksync/build/types";

import { useNetworkStore } from "@/store/network";

export const useLiteProviderStore = defineStore("liteProvider", () => {
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  const {
    inProgress: providerRequestInProgress,
    error: providerRequestError,
    execute: requestProvider,
  } = usePromise<RestProvider>(
    async () => await getDefaultRestProvider(selectedEthereumNetwork.value.network as ZkSyncNetworkName)
  );

  const blockExplorerUrl = computed(() => {
    if (selectedEthereumNetwork.value.network === "mainnet") {
      return "https://zkscan.io";
    }
    return `https://${selectedEthereumNetwork.value.network}.zkscan.io`;
  });

  return {
    providerRequestInProgress: computed(() => providerRequestInProgress.value),
    providerRequestError: computed(() => providerRequestError.value),
    requestProvider,

    blockExplorerUrl,
  };
});
