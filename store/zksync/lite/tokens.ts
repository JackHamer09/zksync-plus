import { defineStore } from "pinia";

import type { TokenInfo } from "zksync/build/types";

import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { checksumAddress } from "@/utils/formatters";
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
    reset: resetTokens,
  } = usePromise<Record<string, ZkSyncLiteToken>>(async () => {
    const provider = await liteProvider.requestProvider();
    if (!provider) throw new Error("Provider is not available");
    const tokens = await provider.getTokens();
    return Object.fromEntries(
      Object.entries(tokens).map(([symbol, token]) => {
        const iconUrl = getTokenIconUrlBySymbol(symbol);
        return [symbol, { ...token, address: checksumAddress(token.address), price: 1, iconUrl }];
      })
    );
  });

  return {
    tokens: computed(() => tokens.value),
    tokensRequestInProgress: computed(() => tokensRequestInProgress.value),
    tokensRequestError: computed(() => tokensRequestError.value),
    requestTokens,
    resetTokens,
  };
});
