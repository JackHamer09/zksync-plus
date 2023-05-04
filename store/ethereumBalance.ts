import { Alchemy, Network, TokenBalanceType } from "alchemy-sdk";
import { defineStore, storeToRefs } from "pinia";

import type { TokenBalance } from "alchemy-sdk";

import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { ETH_ADDRESS } from "@/utils/contstants";
import { checksumAddress } from "@/utils/formatters";

export const useEthereumBalanceStore = defineStore("ethereumBalance", () => {
  const onboardStore = useOnboardStore();
  const { account } = storeToRefs(onboardStore);
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  const {
    result: balance,
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise(
    async () => {
      if (!account.value.address) throw new Error("Account is not available");

      const alchemy = new Alchemy({
        network: selectedEthereumNetwork.value.id === 1 ? Network.ETH_MAINNET : Network.ETH_GOERLI,
      });
      const balances: TokenBalance[] = [];
      const fetchBalances = async (pageKey?: string) => {
        const result = await alchemy.core.getTokenBalances(account.value.address!, {
          type: TokenBalanceType.ERC20,
          pageKey,
        });
        balances.push(
          ...result.tokenBalances.map((token) => ({
            ...token,
            contractAddress: checksumAddress(token.contractAddress),
          }))
        );
        if (result.pageKey) {
          await fetchBalances(result.pageKey);
        }
      };
      const [ethersBalance] = await Promise.all([alchemy.core.getBalance(account.value.address!), fetchBalances()]);
      balances.push({
        contractAddress: ETH_ADDRESS,
        tokenBalance: ethersBalance.toString(),
      } as TokenBalance);
      return balances;
    },
    { cache: false }
  );

  onboardStore.subscribeOnAccountChange(() => {
    resetBalance();
  });

  return {
    balance,
    balanceInProgress,
    balanceError,
    requestBalance,
  };
});
