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
  const onboardStatus = ref<"disconnected" | "connecting" | "connected">("disconnected");

  let accountLoginPromise = {
    promise: undefined as undefined | Promise<void>,
    resolve: undefined as undefined | (() => void),
  };

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

  const account = ref<GetAccountResult>(ethereumClient.getAccount());
  const network = ref<GetNetworkResult>(ethereumClient.getNetwork());
  const web3modal = new Web3Modal(
    { projectId: env.walletConnectProjectID, enableNetworkView: false, enableAccountView: true, themeMode: "light" },
    ethereumClient
  );
  web3modal.setDefaultChain(selectedEthereumNetwork.value);
  ethereumClient.watchAccount((updatedAccount) => {
    if (updatedAccount.isDisconnected && !updatedAccount.isConnecting && !updatedAccount.isReconnecting) {
      setDisconnected();
    }
    account.value = updatedAccount;
    connector = updatedAccount.connector;
    if (updatedAccount.isConnected && accountLoginPromise.resolve) {
      accountLoginPromise.resolve();
    }
  });
  ethereumClient.watchNetwork((updatedNetwork) => (network.value = updatedNetwork));
  web3modal.subscribeModal((state) => {
    if (!state.open && onboardStatus.value === "connecting") {
      setDisconnected();
    }
  });

  const openModal = () => web3modal.openModal();
  const disconnect = () => ethereumClient.disconnect();
  const setDisconnected = () => {
    onboardStatus.value = "disconnected";
    if (accountLoginPromise.resolve) {
      accountLoginPromise.resolve();
      accountLoginPromise = { resolve: undefined, promise: undefined };
    }
  };

  const waitForAccountLogin = async (): Promise<void> => {
    if (accountLoginPromise.promise) return await accountLoginPromise.promise;
    if (account.value.isConnected) return;
    accountLoginPromise.promise = new Promise((resolve) => (accountLoginPromise.resolve = resolve));
    await accountLoginPromise.promise;
  };

  const initiate = async () => {
    try {
      onboardStatus.value = "connecting";
      if (!account.value.isConnected) {
        if (!account.value.isReconnecting) {
          await openModal();
        }
        await waitForAccountLogin();
      }
      if (!account.value.isConnected) {
        return setDisconnected();
      }
      onboardStatus.value = "connected";
      accountLoginPromise = { resolve: undefined, promise: undefined };
    } catch (error) {
      console.warn(`Onboard initiate error:\n`, error);
      setDisconnected();
    }
  };

  if (account.value.isReconnecting) {
    initiate();
  }

  return {
    account,
    onboardStatus,
    openModal,
    disconnect,
    initiate,
  };
});
