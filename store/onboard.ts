import { configureChains, createClient } from "@wagmi/core";
import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { defineStore, storeToRefs } from "pinia";

import type { Client, Provider } from "@wagmi/core";

import { useRuntimeConfig } from "#imports";
import { chains, useNetworkStore } from "@/store/network";
import { formatError } from "@/utils/formatters";

const { public: env } = useRuntimeConfig();

export let connector: Client<Provider>["connector"] | undefined = undefined;
export const useOnboardStore = defineStore("onboard", () => {
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  const { provider } = configureChains(chains, [walletConnectProvider({ projectId: env.walletConnectProjectID })]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({
      projectId: env.walletConnectProjectID,
      version: "1",
      appName: "web3Modal",
      chains: chains,
    }),
    provider,
  });
  const ethereumClient = new EthereumClient(wagmiClient, chains);

  const account = ref(ethereumClient.getAccount());
  const network = ref(ethereumClient.getNetwork());
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
  web3modal.subscribeModal((state) => {
    if (!state.open && !account.value.isConnected) {
      disconnect();
    }
  });

  const walletName = computed(() => account.value.connector?.name);

  const openModal = () => web3modal.openModal();
  const disconnect = () => ethereumClient.disconnect();

  const isCorrectNetworkSet = computed(() => {
    const walletNetworkId = network.value.chain?.id;
    return walletNetworkId === selectedEthereumNetwork.value.id;
  });
  const {
    inProgress: switchingNetworkInProgress,
    error: switchingNetworkError,
    execute: switchNetwork,
  } = usePromise(
    async () => {
      try {
        await ethereumClient.switchNetwork({ chainId: selectedEthereumNetwork.value.id });
      } catch (err) {
        const error = formatError(err as Error);
        if (error) throw error;
      }
    },
    { cache: false }
  );
  const setCorrectNetwork = async () => {
    await switchNetwork().catch(() => undefined);
  };

  return {
    account: computed(() => account.value),
    network: computed(() => network.value),
    walletName,
    openModal,
    disconnect,

    isCorrectNetworkSet,
    switchingNetworkInProgress,
    switchingNetworkError,
    setCorrectNetwork,
  };
});
