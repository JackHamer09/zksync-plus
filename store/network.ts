import { useStorage } from "@vueuse/core";
import { goerli, mainnet } from "@wagmi/core/chains";

export type EthereumNetworkName = "goerli" | "mainnet";

export const networks = [
  goerli,
  {
    ...mainnet,
    name: "mainnet",
  },
];

export const selectedEthereumNetwork = useStorage<EthereumNetworkName>(
  "selectedEthereumNetwork",
  networks[0].name as EthereumNetworkName
);
export const changeEthereumNetwork = (network: EthereumNetworkName) => {
  selectedEthereumNetwork.value = network;
};
