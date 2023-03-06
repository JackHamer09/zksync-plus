import useProvider from "@/composables/zksync/lite/useProvider";

import { selectedEthereumNetwork } from "@/store/network";

export const {
  provider,
  providerRequestInProgress,
  providerRequestError,
  requestProvider,
  changeZkSyncNetwork,

  tokens,
  tokensRequestInProgress,
  tokensRequestError,
  requestTokens,
} = useProvider(selectedEthereumNetwork.value);

watch(selectedEthereumNetwork, changeZkSyncNetwork);
