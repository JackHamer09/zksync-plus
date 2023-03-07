import useProvider from "@/composables/zksync/lite/useProvider";

import type { EthereumNetworkName } from "@/store/network";

import { selectedEthereumNetwork } from "@/store/network";

export const {
  providerRequestInProgress,
  providerRequestError,
  requestProvider,
  changeZkSyncNetwork,

  tokens,
  tokensRequestInProgress,
  tokensRequestError,
  requestTokens,
} = useProvider(selectedEthereumNetwork.value.name.toLowerCase() as EthereumNetworkName);

watch(selectedEthereumNetwork, async (network) => {
  await changeZkSyncNetwork(network.name.toLowerCase() as EthereumNetworkName);
});
