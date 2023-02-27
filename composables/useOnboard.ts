import { configureChains, createClient } from "@wagmi/core";
import { goerli, mainnet } from "@wagmi/core/chains";
import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";

import { useRuntimeConfig } from "#imports";

export default () => {
  const { public: env } = useRuntimeConfig();

  const chains = [goerli, mainnet];
  const { provider } = configureChains(chains, [walletConnectProvider({ projectId: env.walletConnectProjectID })]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({
      projectId: env.walletConnectProjectID,
      version: "2",
      appName: "web3Modal",
      chains,
    }),
    provider,
  });

  // Web3Modal and Ethereum Client
  const ethereumClient = new EthereumClient(wagmiClient, chains);
  const web3modal = new Web3Modal(
    { projectId: env.walletConnectProjectID, enableAccountView: true, themeMode: "light" },
    ethereumClient
  );
  ethereumClient.watchAccount((account) => console.log("account", account));
  ethereumClient.watchNetwork((network) => console.log("network", network));

  const connectWallet = () => {
    web3modal.openModal();
  };

  return {
    connectWallet,
  };
};
