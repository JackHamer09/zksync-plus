import { defineStore } from "pinia";

import type { TokenInfo } from "zksync/build/types";

import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { getTokenIconUrlBySymbol } from "@/utils/tokens/lite";

export interface ZkSyncLiteToken extends TokenInfo {
  price: number;
  iconUrl?: string;
}

export const useLiteTokensStore = defineStore("liteTokens", () => {
  const liteProvider = useLiteProviderStore();

  const {
    result: tokens,
    inProgress: tokensRequestInProgress,
    error: tokensRequestError,
    execute: requestTokens,
    clear: clearTokens,
  } = usePromise<Record<string, ZkSyncLiteToken>>(async () => {
    const provider = await liteProvider.requestProvider();
    if (!provider) throw new Error("Provider is not available");
    const tokens = await provider.getTokens();
    return Object.fromEntries(
      Object.entries(tokens).map(([symbol, token]) => {
        const iconUrl = getTokenIconUrlBySymbol(symbol);
        return [symbol, { ...token, price: 1, iconUrl }];
      })
    );
  });

  return {
    tokens,
    tokensRequestInProgress,
    tokensRequestError,
    requestTokens,
    clearTokens,
  };
});
