import { watch } from "vue";

import { BigNumber, VoidSigner } from "ethers";
import { defineStore, storeToRefs } from "pinia";
import { Wallet } from "zksync";

import type { BigNumberish } from "ethers";
import type { AccountState } from "zksync/build/types";

import { useEthWalletStore } from "@/store/ethWallet";
import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore, type ZkSyncLiteToken } from "@/store/zksync/lite/tokens";
import { InfuraProviderEx } from "@/utils/InfuraProviderEx";
import { checksumAddress, formatError } from "@/utils/formatters";

export interface Balance extends ZkSyncLiteToken {
  amount: BigNumberish;
}

export const useLiteWalletStore = defineStore("liteWallet", () => {
  const ethWalletStore = useEthWalletStore();
  const liteProviderStore = useLiteProviderStore();
  const liteTokensStore = useLiteTokensStore();
  const { tokens } = storeToRefs(liteTokensStore);
  const { account, network } = storeToRefs(useOnboardStore());
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  let wallet: Wallet | undefined = undefined;
  const walletAddress = ref<string | undefined>(undefined);
  const isAuthorized = ref(false);
  const isRemoteWallet = ref(false);

  const { execute: getWalletInstanceNoSigner, reset: resetWalletInstanceNoSigner } = usePromise<Wallet>(async () => {
    const provider = await liteProviderStore.requestProvider();
    if (!provider) throw new Error("Provider is not available");
    const walletNetworkId = network.value.chain?.id;
    if (walletNetworkId !== selectedEthereumNetwork.value.id) {
      const voidSigner = new VoidSigner(account.value.address!, new InfuraProviderEx(selectedEthereumNetwork.value.id));
      wallet = await Wallet.fromEthSignerNoKeys(voidSigner, provider);
    } else {
      const ethWalletSigner = await ethWalletStore.getEthWalletSigner();
      wallet = await Wallet.fromEthSignerNoKeys(ethWalletSigner, provider);
    }
    return wallet;
  });
  const {
    execute: getWalletInstanceWithSigner,
    reset: resetWalletInstanceWithSigner,
    inProgress: authorizationInProgress,
    error: authorizationError,
  } = usePromise<Wallet>(async () => {
    const walletNetworkId = network.value.chain?.id;
    if (walletNetworkId !== selectedEthereumNetwork.value.id) {
      throw new Error(
        `Incorrect wallet network selected: #${walletNetworkId} (expected: ${selectedEthereumNetwork.value.name} #${selectedEthereumNetwork.value.id})`
      );
    }

    const provider = await liteProviderStore.requestProvider();
    if (!provider) throw new Error("Provider is not available");
    const ethWalletSigner = await ethWalletStore.getEthWalletSigner();
    wallet = await Wallet.fromEthSigner(ethWalletSigner, provider);
    return wallet;
  });
  const getWalletInstance = async (withSigner = false) => {
    if (withSigner || wallet?.syncSignerConnected()) {
      await getWalletInstanceWithSigner();
    } else {
      await getWalletInstanceNoSigner();
    }
    if (wallet) {
      isAuthorized.value = wallet.syncSignerConnected();
      walletAddress.value = checksumAddress(wallet.address());
    } else {
      isAuthorized.value = false;
      walletAddress.value = undefined;
    }
    return wallet;
  };
  const resetWalletInstance = () => {
    wallet = undefined;
    resetWalletInstanceNoSigner();
    resetWalletInstanceWithSigner();
  };
  const getSignerPubKeyHash = async () => {
    const wallet = await getWalletInstance(true);
    if (!wallet) throw new Error("Wallet is not available");
    return isRemoteWallet.value ? await wallet.syncSignerPubKeyHash() : await wallet.signer!.pubKeyHash();
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
  } = usePromise<void>(
    async () => {
      await Promise.all([requestAccountState({ force: true }), liteTokensStore.requestTokens()]);
      if (!accountState.value) throw new Error("Account state is not available");
      if (!tokens.value) throw new Error("Tokens are not available");
    },
    { cache: 30000 }
  );
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
    walletAddress.value = undefined;
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
    walletAddress,

    isAuthorized,
    authorizationInProgress,
    authorizationError: computed(() => formatError(authorizationError.value)),
    authorizeWallet: () => getWalletInstance(true),
    getSignerPubKeyHash,

    isRemoteWallet,
    getWalletInstance,

    accountState,
    requestAccountState,

    balance,
    balanceInProgress: computed(() => balanceInProgress.value),
    balanceError: computed(() => balanceError.value),
    allBalancePricesLoaded,
    requestBalance,
  };
});
