import { watchEffect } from "vue";

import { defineStore, storeToRefs } from "pinia";
import { Wallet } from "zksync";

import type { BigNumberish } from "ethers";
import type { AccountState } from "zksync/build/types";

import { useEthWalletStore } from "@/store/ethWallet";
import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";

export type Balance = {
  symbol: string;
  address: string;
  decimals: number;
  amount: BigNumberish;
  price: number;
};

export const useLiteWalletStore = defineStore("liteWallet", () => {
  let wallet: Wallet | undefined = undefined;
  const liteProvider = useLiteProviderStore();
  const { tokens } = storeToRefs(liteProvider);
  const { account } = storeToRefs(useOnboardStore());
  const { getEthWalletSigner } = useEthWalletStore();

  const walletCreated = ref(false);

  const {
    result: accountState,
    execute: requestAccountState,
    clear: clearAccountState,
  } = usePromise<AccountState>(async () => {
    if (!wallet) throw new Error("Wallet is not available");
    return await wallet.getAccountState();
  });

  const balance = computed<Balance[]>(() => {
    if (!accountState.value) {
      return [];
    }
    return Object.entries(tokens.value ?? {}).map(([symbol, token]) => {
      const { address, decimals } = token;
      const amount = accountState.value!.committed.balances[symbol] ?? "0";
      const price = 10;
      return { symbol, address, decimals, amount, price };
    });
  });
  const {
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    clear: clearBalance,
  } = usePromise<void>(async () => {
    const [, tokens] = await Promise.all([requestAccountState(), liteProvider.requestTokens()]);
    if (!accountState.value) throw new Error("Account state is not available");
    if (!tokens) throw new Error("Tokens are not available");
    /* Object.entries(tokens.value).map(([symbol]) => {
      // get token price
    }); */
  });

  const clear = () => {
    wallet = undefined;
    walletCreated.value = false;
    clearAccountState();
    clearBalance();
  };

  const createWallet = async () => {
    clear();
    const provider = await liteProvider.requestProvider();
    if (!provider) throw new Error("Provider is not available");
    const ethWalletSigner = await getEthWalletSigner();
    wallet = await Wallet.fromEthSignerNoKeys(ethWalletSigner, provider);
    walletCreated.value = true;
  };

  watchEffect(() => {
    if (
      (account.value.isConnected && !wallet) ||
      (wallet && account.value.address && wallet.address() !== account.value.address)
    ) {
      createWallet().then(() => {
        requestBalance();
      });
    } else if (account.value.isDisconnected) {
      clear();
    }
  });

  return {
    walletCreated,

    balance,
    balanceInProgress,
    balanceError,
    requestBalance,

    createWallet,
  };
});
