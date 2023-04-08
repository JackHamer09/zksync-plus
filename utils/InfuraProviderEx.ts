import { InfuraProvider } from "@ethersproject/providers";
import { ethers } from "ethers";

export class InfuraProviderEx extends ethers.providers.JsonRpcBatchProvider {
  constructor(chainId: string | number) {
    const apiKey = InfuraProvider.getApiKey(null);
    const network = InfuraProvider.getNetwork(chainId);
    const url = InfuraProvider.getUrl(network, apiKey);

    super(url, network);
  }
}
