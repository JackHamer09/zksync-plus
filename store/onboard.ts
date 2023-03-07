import { useStorage } from "@vueuse/core";
import { configureChains, createClient } from "@wagmi/core";
import { goerli, mainnet } from "@wagmi/core/chains";
import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";

import type { Client, GetAccountResult, GetNetworkResult, Provider } from "@wagmi/core";

import { useRuntimeConfig } from "#imports";
import { selectedEthereumNetwork } from "@/store/network";

const { public: env } = useRuntimeConfig();

export const wasConnected = useStorage("wasConnected", false);
export let connector: Client<Provider>["connector"] | undefined = undefined;
export const account = ref<GetAccountResult>({
  address: undefined,
  connector: undefined,
  isConnected: false,
  isReconnecting: false,
  isConnecting: false,
  isDisconnected: true,
  status: "disconnected",
});
watch(account, (newAccount) => {
  if (newAccount.isConnected) {
    wasConnected.value = true;
  } else {
    wasConnected.value = null;
  }
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
  { projectId: env.walletConnectProjectID, enableNetworkView: false, enableAccountView: true, themeMode: "light" },
  ethereumClient
);
web3modal.setDefaultChain(selectedEthereumNetwork.value);
ethereumClient.watchAccount((updatedAccount) => {
  account.value = updatedAccount;
  connector = updatedAccount.connector;
});
ethereumClient.watchNetwork((updatedNetwork) => (network.value = updatedNetwork));

export const openModal = () => web3modal.openModal();
export const disconnect = () => ethereumClient.disconnect();
