import { useStorage } from "@vueuse/core";
import { goerli, mainnet } from "@wagmi/core/chains";
import { defineStore } from "pinia";

import type { Chain } from "@wagmi/core/chains";
export type EthereumNetworkName = "goerli" | "mainnet";

export type ExtendedChain = Chain & { network: EthereumNetworkName; iconUrl?: string; hostnames: string[] };
export const chains: ExtendedChain[] = [
  {
    ...mainnet,
    name: "Mainnet",
    network: "mainnet",
    iconUrl: "/img/ethereum.svg",
    hostnames: [],
  },
  {
    ...goerli,
    name: "Goerli Testnet",
    hostnames: [],
  },
];

export const useNetworkStore = defineStore("network", () => {
  const selectedEthereumNetworkName = useStorage<EthereumNetworkName>(
    "selectedEthereumNetwork",
    chains[0].network,
    window.sessionStorage
  );
  const selectedEthereumNetwork = computed<ExtendedChain>(() => {
    return chains.find((network) => network.network === selectedEthereumNetworkName.value) ?? chains[0];
  });
  const blockExplorerUrl = computed<string | undefined>(
    () => selectedEthereumNetwork.value.blockExplorers?.default.url
  );

  const lastSelectedEthereumNetworkName = useStorage<EthereumNetworkName | undefined>(
    "lastSelectedEthereumNetwork",
    undefined
  );
  const lastSelectedEthereumNetwork = computed<ExtendedChain | undefined>(() => {
    return chains.find((network) => network.network === lastSelectedEthereumNetworkName.value);
  });
  const ethereumNetworkChangedWarning = computed(
    () =>
      !!lastSelectedEthereumNetworkName.value &&
      lastSelectedEthereumNetwork.value?.network !== selectedEthereumNetwork.value.network
  );
  watch(selectedEthereumNetworkName, (val) => {
    lastSelectedEthereumNetworkName.value = val;
  });

  const identifyNetwork = () => {
    const windowLocation = window.location;
    const networkFromQueryParam = new URLSearchParams(windowLocation.search).get("network");
    const networkOnDomain = chains.find((e) => e.hostnames.includes(windowLocation.origin));
    const defaultNetwork = chains[0];
    if (networkFromQueryParam && chains.some((e) => e.network === networkFromQueryParam)) {
      selectedEthereumNetworkName.value = networkFromQueryParam as EthereumNetworkName;
    } else if (selectedEthereumNetworkName.value === defaultNetwork.name) {
      if (networkOnDomain) {
        selectedEthereumNetworkName.value = networkOnDomain.network;
      } else {
        selectedEthereumNetworkName.value = defaultNetwork.network;
      }
    }
  };
  identifyNetwork();

  return {
    selectedEthereumNetwork,
    blockExplorerUrl,

    ethereumNetworkChangedWarning,
    lastSelectedEthereumNetworkName: computed(
      () => lastSelectedEthereumNetwork.value?.name ?? lastSelectedEthereumNetworkName.value
    ),
    lastSelectedEthereumNetwork,
    resetNetworkChangeWarning: () => {
      lastSelectedEthereumNetworkName.value = selectedEthereumNetwork.value.network;
    },
  };
});
