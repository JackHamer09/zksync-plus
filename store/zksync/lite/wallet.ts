import { watchEffect } from "vue";

import { Wallet } from "zksync";

import type { BigNumberish } from "ethers";
import type { AccountState } from "zksync/build/types";

import { getEthWalletSigner } from "@/store/ethWallet";
import { account } from "@/store/onboard";
import { requestProvider, requestTokens, tokens } from "@/store/zksync/lite/provider";

type Balance = {
  symbol: string;
  address: string;
  decimals: number;
  amount: BigNumberish;
  price: number;
};

let wallet: Wallet | undefined = undefined;
export const walletCreated = ref(false);

export const {
  result: accountState,
  inProgress: accountStateInProgress,
  error: accountStateError,
  execute: requestAccountState,
  clear: clearAccountState,
} = usePromise<AccountState>(async () => {
  if (!wallet) throw new Error("Wallet is not available");
  return await wallet.getAccountState();
});

export const balance = computed<Balance[]>(() => {
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

export const {
  inProgress: balanceInProgress,
  error: balanceError,
  execute: requestBalance,
  clear: clearBalance,
} = usePromise<void>(async () => {
  const [, tokens] = await Promise.all([requestAccountState(), requestTokens()]);
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

export const createWallet = async () => {
  clear();
  const provider = await requestProvider();
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
