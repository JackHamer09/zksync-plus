import { watch } from "vue";

import { fetchSigner } from "@wagmi/core";
import { BigNumber, VoidSigner } from "ethers";
import { ethers } from "ethers";
import { defineStore, storeToRefs } from "pinia";
import { RemoteWallet, Wallet } from "zksync";

import type { BigNumberish } from "ethers";
import type { AccountState } from "zksync/build/types";

import { useNetworkStore } from "@/store/network";
import { useOnboardStore } from "@/store/onboard";
import { useLiteProviderStore } from "@/store/zksync/lite/provider";
import { useLiteTokensStore, type ZkSyncLiteToken } from "@/store/zksync/lite/tokens";
import { formatError } from "@/utils/formatters";

export interface Balance extends ZkSyncLiteToken {
  amount: BigNumberish;
}

export const useLiteWalletStore = defineStore("liteWallet", () => {
  const onboardStore = useOnboardStore();
  const liteProviderStore = useLiteProviderStore();
  const liteTokensStore = useLiteTokensStore();
  const { tokens } = storeToRefs(liteTokensStore);
  const { account, network, walletName } = storeToRefs(onboardStore);
  const { selectedEthereumNetwork } = storeToRefs(useNetworkStore());

  let wallet: Wallet | undefined = undefined;
  const isAuthorized = ref(false);
  const isRemoteWallet = ref(false);

  const getRemoteWallet = async () => {
    const provider = await liteProviderStore.requestProvider();
    if (!provider) throw new Error("Provider is not available");

    const signer = await fetchSigner();
    if (!signer) throw new Error("Signer is not available");

    /* TODO: Fix Argent connection */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const web3Provider = new ethers.providers.Web3Provider(signer?.provider!.provider, "any");
    return (await RemoteWallet.fromEthSigner(web3Provider, provider)) as unknown as Wallet;
  };

  const { execute: getWalletInstanceNoSigner, reset: resetWalletInstanceNoSigner } = usePromise<Wallet>(
    async () => {
      const provider = await liteProviderStore.requestProvider();
      if (!provider) throw new Error("Provider is not available");
      const walletNetworkId = network.value.chain?.id;
      if (walletNetworkId !== selectedEthereumNetwork.value.id) {
        const voidSigner = new VoidSigner(account.value.address!, onboardStore.getEthereumProvider());
        wallet = await Wallet.fromEthSignerNoKeys(voidSigner, provider);
      } else if (walletName.value === "Argent") {
        wallet = await getRemoteWallet();
        isRemoteWallet.value = true;
      } else {
        const signer = await fetchSigner();
        if (!signer) throw new Error("Signer is not available");

        wallet = await Wallet.fromEthSignerNoKeys(signer, provider);
      }
      return wallet;
    },
    { cache: false }
  );
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

    if (walletName.value === "Argent") {
      wallet = await getRemoteWallet();
      isRemoteWallet.value = true;
    } else {
      const signer = await fetchSigner();
      if (!signer) throw new Error("Signer is not available");

      wallet = await Wallet.fromEthSigner(signer, provider);
    }
    return wallet;
  });
  const getWalletInstance = async (withSigner = false) => {
    if (withSigner || wallet?.syncSignerConnected()) {
      await getWalletInstanceWithSigner();
    } else {
      await getWalletInstanceNoSigner();
    }
    if (wallet) {
      isAuthorized.value = isRemoteWallet.value || wallet.syncSignerConnected();
    } else {
      isAuthorized.value = false;
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
    const provider = await liteProviderStore.requestProvider();
    if (!provider) throw new Error("Provider is not available");

    if (!account.value.address) throw new Error("Account is not available");

    return await provider.getState(account.value.address);
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
        if (BigNumber.from(amount).isZero()) return;
        liteTokensStore.requestTokenPrice(symbol);
      });
    },
    { immediate: true }
  );

  onboardStore.subscribeOnAccountChange(() => {
    isAuthorized.value = false;
    isRemoteWallet.value = false;
    resetWalletInstance();
    resetAccountState();
    resetBalance();
  });

  return {
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
