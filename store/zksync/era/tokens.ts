import { getTokenCollection } from "@matterlabs/token-library";
import { defineStore, storeToRefs } from "pinia";

import type { Token, TokenPrice } from "@/types";

import { useEraProviderStore } from "@/store/zksync/era/provider";
import { checksumAddress } from "@/utils/formatters";

export const useEraTokensStore = defineStore("eraTokens", () => {
  const eraProviderStore = useEraProviderStore();
  const { eraNetwork } = storeToRefs(eraProviderStore);

  const {
    result: tokensRaw,
    inProgress: tokensRequestInProgress,
    error: tokensRequestError,
    execute: requestTokens,
    reset: resetTokens,
  } = usePromise<Token[]>(async () => {
    const tokens = await getTokenCollection(eraNetwork.value.chainId);
    return tokens.map((token) => ({
      l1Address: checksumAddress(token.l1Address),
      address: checksumAddress(token.l2Address),
      symbol: token.symbol,
      decimals: token.decimals,
      iconUrl: token.imageUrl,
      enabledForFees: token.l2Address === ETH_ADDRESS,
      price: undefined,
    }));
  });

  const tokenPrices = ref<{ [tokenAddress: string]: TokenPrice }>({});
  const requestTokenPrice = async (tokenAddress: string, { force } = { force: false }) => {
    if (!force && typeof tokenPrices.value[tokenAddress] === "number") return;
    if (tokenPrices.value[tokenAddress] === "loading") return;
    tokenPrices.value[tokenAddress] = "loading";
    try {
      const provider = eraProviderStore.requestProvider();

      const price = await provider.getTokenPrice(tokenAddress);
      tokenPrices.value[tokenAddress] = typeof price === "number" || typeof price === "string" ? parseFloat(price) : 0;
    } catch (error) {
      console.warn(`Failed to get price for Era token ${tokenAddress}`, error);
      tokenPrices.value[tokenAddress] = undefined;
    }
  };

  const tokens = computed<{ [tokenAddress: string]: Token } | undefined>(() => {
    if (!tokensRaw.value) return undefined;
    return Object.fromEntries(
      tokensRaw.value.map((token) => {
        return [token.address, { ...token, price: tokenPrices.value[token.address] }];
      })
    );
  });

  return {
    tokens: computed(() => tokens.value),
    tokensRequestInProgress: computed(() => tokensRequestInProgress.value),
    tokensRequestError: computed(() => tokensRequestError.value),
    requestTokens,
    resetTokens,

    requestTokenPrice,
  };
});
