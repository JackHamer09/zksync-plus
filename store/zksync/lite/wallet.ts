import { Wallet } from "zksync";

import type { BigNumberish } from "ethers";
import type { AccountState } from "zksync/build/types";

import { getEthWalletSigner } from "@/store/ethWallet";
import { provider, requestProvider, requestTokens, tokens } from "@/store/zksync/lite/provider";

type Balance = {
  symbol: string;
  address: string;
  decimals: number;
  amount: BigNumberish;
  price: number;
};

export let wallet: Wallet | undefined = undefined;

export const createWallet = async () => {
  if (!provider.value) {
    await requestProvider();
    if (!provider.value) throw new Error("Provider is not available");
  }
  const ethWalletSigner = await getEthWalletSigner();
  wallet = await Wallet.fromEthSignerNoKeys(ethWalletSigner, provider.value);
};

export const {
  result: accountState,
  inProgress: accountStateInProgress,
  error: accountStateError,
  execute: requestAccountState,
} = usePromise<AccountState>(async () => {
  if (!wallet) throw new Error("Wallet is not available");
  return await wallet.getAccountState();
});

export const balance = computed<Balance[]>(() => {
  return Object.entries(tokens.value ?? {}).map(([symbol, token]) => {
    const { address, decimals } = token;
    const amount = accountState.value!.committed.balances[address] ?? "0";
    const price = 0;
    return { symbol, address, decimals, amount, price };
  });
});
export const {
  inProgress: balanceInProgress,
  error: balanceError,
  execute: requestBalance,
} = usePromise<void>(async () => {
  await Promise.all([requestAccountState(), requestTokens()]);
  if (!accountState.value) throw new Error("Account state is not available");
  if (!tokens.value) throw new Error("Tokens are not available");
  /* Object.entries(tokens.value).map(([symbol]) => {
    // get token price
  }); */
});
