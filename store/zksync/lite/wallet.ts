import { watch } from "vue";

import { BigNumber } from "ethers";
import { defineStore, storeToRefs } from "pinia";
import { Wallet } from "zksync";

import type { BigNumberish } from "ethers";
import type { AccountState } from "zksync/build/types";

import { useEthWalletStore } from "@/store/ethWallet";
import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore, type ZkSyncLiteToken } from "@/store/zksync/lite/tokens";
import { parseTokenAmount, removeSmallAmount } from "@/utils/formatters";
import { isOnlyZeroes } from "@/utils/helpers";

export interface Balance extends ZkSyncLiteToken {
  amount: BigNumberish;
}

export const useLiteWalletStore = defineStore("liteWallet", () => {
  const liteProviderStore = useLiteProviderStore();
  const liteTokensStore = useLiteTokensStore();
  const { tokens } = storeToRefs(liteTokensStore);
  const { account } = storeToRefs(useOnboardStore());
  const { getEthWalletSigner } = useEthWalletStore();

  let wallet: Wallet | undefined = undefined;
  const isRemoteWallet = ref(false);

  const { execute: getWalletInstance, reset: resetWalletInstance } = usePromise<Wallet>(async () => {
    const provider = await liteProviderStore.requestProvider();
    if (!provider) throw new Error("Provider is not available");
    const ethWalletSigner = await getEthWalletSigner();
    wallet = await Wallet.fromEthSignerNoKeys(ethWalletSigner, provider);
    return wallet;
  });

  const {
    result: accountState,
    execute: requestAccountState,
    reset: resetAccountState,
  } = usePromise<AccountState>(async () => {
    const wallet = await getWalletInstance();
    if (!wallet) throw new Error("Wallet is not available");
    return await wallet.getAccountState();
  });

  const balance = computed<Balance[]>(() => {
    if (!accountState.value) {
      return [];
    }
    return Object.entries(tokens.value ?? {}).map(([symbol, token]) => {
      const amount = accountState.value!.committed.balances[symbol] ?? "0";
      return { ...token, amount };
    });
  });
  const allBalancePricesLoaded = computed(() => !balance.value.some((e) => e.price === "loading"));
  const {
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise<void>(async () => {
    await Promise.all([requestAccountState({ force: true }), liteTokensStore.requestTokens()]);
    if (!accountState.value) throw new Error("Account state is not available");
    if (!tokens.value) throw new Error("Tokens are not available");
  });

  watch(
    balance,
    (balances) => {
      balances.map(({ symbol, amount }) => {
        if (BigNumber.from(amount).eq("0")) return;
        liteTokensStore.requestTokenPrice(symbol);
      });
    },
    { immediate: true }
  );

  const reset = () => {
    wallet = undefined;
    resetWalletInstance();
    resetAccountState();
    resetBalance();
  };

  watch(account, async () => {
    if (
      (account.value.isConnected && !wallet) ||
      (wallet && account.value.address && wallet.address() !== account.value.address)
    ) {
      reset();
      await requestBalance();
    } else if (account.value.isDisconnected) {
      reset();
    }
  });

  return {
    isRemoteWallet,
    getWalletInstance,

    requestAccountState,

    balance,
    balanceInProgress: computed(() => balanceInProgress.value),
    balanceError: computed(() => balanceError.value),
    allBalancePricesLoaded,
    requestBalance,
  };
});
