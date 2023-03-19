import { useStorage } from "@vueuse/core";
import { goerli, mainnet } from "@wagmi/core/chains";
import { defineStore } from "pinia";

import type { Chain } from "@wagmi/core/chains";
export type EthereumNetworkName = "goerli" | "mainnet";

export const chains: Chain[] = [
  goerli,
  {
    ...mainnet,
    network: "mainnet",
  },
];

export const useNetworkStore = defineStore("network", () => {
  const selectedEthereumNetworkName = useStorage<EthereumNetworkName>(
    "selectedEthereumNetwork",
    chains[0].network as EthereumNetworkName
  );
  const selectedEthereumNetwork = computed<Chain>(() => {
    return chains.find((network) => network.network === selectedEthereumNetworkName.value) ?? chains[0];
  });
  const changeEthereumNetwork = (networkName: EthereumNetworkName) => {
    selectedEthereumNetworkName.value = networkName;
  };

  return {
    selectedEthereumNetwork,
    changeEthereumNetwork,
  };
});
