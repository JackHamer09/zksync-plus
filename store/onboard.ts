import { configureChains, createClient } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";
import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { defineStore, storeToRefs } from "pinia";

import { useRuntimeConfig } from "#imports";
import { chains, useNetworkStore } from "@/store/network";
import { formatError } from "@/utils/formatters";

const { public: env } = useRuntimeConfig();

export const useOnboardStore = defineStore("onboard", () => {
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  const { provider } = configureChains(chains, [
    walletConnectProvider({ projectId: env.walletConnectProjectID }),
    publicProvider(),
  ]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({
      projectId: env.walletConnectProjectID,
      version: "1",
      appName: "zkSync Plus",
      chains: chains,
    }),
    provider,
  });
  const ethereumClient = new EthereumClient(wagmiClient, chains);

  const getWalletName = () => {
    if (wagmiClient.connector?.name === "WalletConnect") {
      /* TODO: Figure our how to properly get wallet name from WalletConnect */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return wagmiClient.data?.provider?.provider?.connector?.peerMeta?.name;
    }
    return wagmiClient.connector?.name;
  };

  const account = ref(ethereumClient.getAccount());
  const network = ref(ethereumClient.getNetwork());
  const connectorName = ref(wagmiClient.connector?.name);
  const walletName = ref<string | undefined>(getWalletName());
  const web3modal = new Web3Modal(
    { projectId: env.walletConnectProjectID, enableNetworkView: false, enableAccountView: true, themeMode: "light" },
    ethereumClient
  );
  web3modal.setDefaultChain(selectedEthereumNetwork.value);
  ethereumClient.watchAccount(async (updatedAccount) => {
    account.value = updatedAccount;
    connectorName.value = wagmiClient.connector?.name;
    walletName.value = getWalletName();
  });
  ethereumClient.watchNetwork((updatedNetwork) => (network.value = updatedNetwork));
  web3modal.subscribeModal((state) => {
    if (!state.open && !account.value.isConnected) {
      disconnect();
    }
  });

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
        if (err instanceof Error && err.message.includes("does not support programmatic chain switching")) {
          throw new Error(
            `Please switch network manually to "${selectedEthereumNetwork.value.name}" in your ${walletName.value} wallet`
          );
        }
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

    getEthereumProvider: () => provider({ chainId: selectedEthereumNetwork.value.id }),
  };
});
