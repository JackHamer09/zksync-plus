import { configureChains, createClient } from "@wagmi/core";
import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { defineStore, storeToRefs } from "pinia";

import type { Client, GetAccountResult, GetNetworkResult, Provider } from "@wagmi/core";

import { useRuntimeConfig } from "#imports";
import { chains, useNetworkStore } from "@/store/network";

const { public: env } = useRuntimeConfig();

export let connector: Client<Provider>["connector"] | undefined = undefined;
export const useOnboardStore = defineStore("onboard", () => {
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  const account = ref<GetAccountResult>({
    address: undefined,
    connector: undefined,
    isConnected: false,
    isReconnecting: false,
    isConnecting: false,
    isDisconnected: true,
    status: "disconnected",
  });
  const network = ref<GetNetworkResult>({
    chain: undefined,
    chains: chains,
  });

  const { provider } = configureChains(network.value.chains, [
    walletConnectProvider({ projectId: env.walletConnectProjectID }),
  ]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({
      projectId: env.walletConnectProjectID,
      version: "1",
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

  const openModal = () => web3modal.openModal();
  const disconnect = () => ethereumClient.disconnect();

  return {
    account,
    openModal,
    disconnect,
  };
});
