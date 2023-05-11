import { defineStore, storeToRefs } from "pinia";
import { Provider } from "zksync-web3";

import type { EthereumNetworkName } from "@/store/network";

import { useNetworkStore } from "@/store/network";

const eraNetworks: Record<EthereumNetworkName, { chainId: 324 | 280; rpcUrl: string }> = {
  mainnet: {
    chainId: 324,
    rpcUrl: "https://mainnet.era.zksync.dev",
  },
  goerli: {
    chainId: 280,
    rpcUrl: "https://testnet.era.zksync.dev",
  },
} as const;

export const useEraProviderStore = defineStore("eraProvider", () => {
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());
  const eraNetwork = computed(() => eraNetworks[selectedEthereumNetwork.value.network]);
  const provider = new Provider(eraNetwork.value.rpcUrl);

  const requestProvider = () => provider;

  const blockExplorerUrl = computed(() => {
    if (selectedEthereumNetwork.value.network === "mainnet") {
      return "https://explorer.zksync.io";
    }
    return `https://${selectedEthereumNetwork.value.network}.explorer.zksync.io`;
  });

  return {
    eraNetwork,

    requestProvider,

    blockExplorerUrl,
  };
});
