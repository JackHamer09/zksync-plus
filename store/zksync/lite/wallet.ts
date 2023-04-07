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
  const isAuthorized = ref(false);
  const isRemoteWallet = ref(false);

  const { execute: getWalletInstanceNoSigner, reset: resetWalletInstanceNoSigner } = usePromise<Wallet>(async () => {
    const provider = await liteProviderStore.requestProvider();
    if (!provider) throw new Error("Provider is not available");
    const ethWalletSigner = await getEthWalletSigner();
    wallet = await Wallet.fromEthSignerNoKeys(ethWalletSigner, provider);
    isAuthorized.value = wallet.syncSignerConnected();
    return wallet;
  });
  const {
    execute: getWalletInstanceWithSigner,
    reset: resetWalletInstanceWithSigner,
    inProgress: authorizationInProgress,
    error: authorizationError,
  } = usePromise<Wallet>(async () => {
    const provider = await liteProviderStore.requestProvider();
    if (!provider) throw new Error("Provider is not available");
    const ethWalletSigner = await getEthWalletSigner();
    wallet = await Wallet.fromEthSigner(ethWalletSigner, provider);
    isAuthorized.value = wallet.syncSignerConnected();
    console.log("isAuthorized.value", isAuthorized.value);
    return wallet;
  });
  const getWalletInstance = async (withSigner = false) => {
    if (withSigner || (wallet && wallet.syncSignerConnected())) {
      return await getWalletInstanceWithSigner();
    }
    return await getWalletInstanceNoSigner();
  };
  const resetWalletInstance = () => {
    wallet = undefined;
    resetWalletInstanceNoSigner();
    resetWalletInstanceWithSigner();
  };

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
    isAuthorized.value = false;
    isRemoteWallet.value = false;
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
    isAuthorized,
    authorizationInProgress,
    authorizationError: computed(() => {
      const message = authorizationError.value?.message;
      if (typeof message === "string") {
        if (
          message.includes("User denied") ||
          message.includes("User rejected") ||
          message.includes(`"Request rejected"`)
        ) {
          return undefined;
        }
      }
      return authorizationError.value;
    }),
    authorizeWallet: () => getWalletInstance(true),

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
