import { configureChains, createClient } from "@wagmi/core";
import { goerli, mainnet } from "@wagmi/core/chains";
import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";

import type { GetAccountResult, GetNetworkResult } from "@wagmi/core";

import { useRuntimeConfig } from "#imports";

const { public: env } = useRuntimeConfig();

export const account = ref<GetAccountResult>({
  address: undefined,
  connector: undefined,
  isConnected: false,
  isReconnecting: false,
  isConnecting: false,
  isDisconnected: true,
  status: "disconnected",
});
export const network = ref<GetNetworkResult>({
  chain: undefined,
  chains: [goerli, mainnet],
});

const { provider } = configureChains(network.value.chains, [
  walletConnectProvider({ projectId: env.walletConnectProjectID }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: env.walletConnectProjectID,
    version: "2",
    appName: "web3Modal",
    chains: network.value.chains,
  }),
  provider,
});

const ethereumClient = new EthereumClient(wagmiClient, network.value.chains);
const web3modal = new Web3Modal(
  { projectId: env.walletConnectProjectID, enableAccountView: true, themeMode: "light" },
  ethereumClient
);
ethereumClient.watchAccount((updatedAccount) => (account.value = updatedAccount));
ethereumClient.watchNetwork((updatedNetwork) => (network.value = updatedNetwork));

export const openModal = () => web3modal.openModal();
