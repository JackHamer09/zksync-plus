import { defineStore } from "pinia";

import type { ExtendedTokens, TokenInfo } from "zksync/build/types";

import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { checksumAddress } from "@/utils/formatters";
import { getTokenIconUrlBySymbol } from "@/utils/tokens/lite";

export type ZkSyncLiteTokenPrice = number | "loading" | undefined;
export interface ZkSyncLiteToken extends TokenInfo {
  price: ZkSyncLiteTokenPrice;
  iconUrl?: string;
}

export const useLiteTokensStore = defineStore("liteTokens", () => {
  const liteProvider = useLiteProviderStore();

  const {
    result: tokensRaw,
    inProgress: tokensRequestInProgress,
    error: tokensRequestError,
    execute: requestTokens,
    reset: resetTokens,
  } = usePromise<TokenInfo[]>(async () => {
    const provider = await liteProvider.requestProvider();
    if (!provider) throw new Error("Provider is not available");
    // const tokens = await provider.getTokens(); <-- this is the right way but tokens are already available in the provider
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tokens = provider.tokenSet.tokensBySymbol as ExtendedTokens;
    return Object.entries(tokens).map(([, token]) => ({ ...token, address: checksumAddress(token.address) }));
  });

  const tokenPrices = ref<{ [tokenSymbol: string]: ZkSyncLiteTokenPrice }>({});
  const requestTokenPrice = async (tokenSymbol: string, { force } = { force: false }) => {
    if (!force && typeof tokenPrices.value[tokenSymbol] === "number") return;
    if (tokenPrices.value[tokenSymbol] === "loading") return;
    tokenPrices.value[tokenSymbol] = "loading";
    try {
      const provider = await liteProvider.requestProvider();
      if (!provider) throw new Error("Provider is not available");
      const price = await provider.getTokenPrice(tokenSymbol);
      tokenPrices.value[tokenSymbol] = typeof price === "number" ? price : 0;
    } catch (error) {
      console.warn(`Failed to get price for zkSync Lite token ${tokenSymbol}`, error);
      tokenPrices.value[tokenSymbol] = undefined;
    }
  };

  const tokens = computed<{ [tokenSymbol: string]: ZkSyncLiteToken } | undefined>(() => {
    if (!tokensRaw.value) return undefined;
    return Object.fromEntries(
      tokensRaw.value.map((token) => {
        const iconUrl = getTokenIconUrlBySymbol(token.symbol);
        return [token.symbol, { ...token, price: tokenPrices.value[token.symbol], iconUrl }];
      })
    );
  });

  return {
    tokens: computed(() => tokens.value),
    tokensRequestInProgress: computed(() => tokensRequestInProgress.value),
    tokensRequestError: computed(() => tokensRequestError.value),
    requestTokens,
    resetTokens,

    tokenPrices: computed(() => tokenPrices.value),
    requestTokenPrice,
  };
});
