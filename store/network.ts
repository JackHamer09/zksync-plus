import { useStorage } from "@vueuse/core";
import { goerli, mainnet } from "@wagmi/core/chains";

import type { Chain } from "@wagmi/core/chains";

export type EthereumNetworkName = "goerli" | "mainnet";

export const networks: Chain[] = [
  goerli,
  {
    ...mainnet,
    name: "mainnet",
  },
];

const selectedEthereumNetworkName = useStorage<EthereumNetworkName>(
  "selectedEthereumNetwork",
  networks[0].network as EthereumNetworkName
);
export const selectedEthereumNetwork = computed<Chain>(() => {
  return (
    networks.find((network) => {
      const currentNetworkName =
        selectedEthereumNetworkName.value === "mainnet" ? mainnet.network : selectedEthereumNetworkName.value;
      return network.network === currentNetworkName;
    }) ?? networks[0]
  );
});
export const changeEthereumNetwork = (networkName: EthereumNetworkName) => {
  selectedEthereumNetworkName.value = networkName;
};
