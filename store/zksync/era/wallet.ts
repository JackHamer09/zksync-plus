import { watch } from "vue";

import { fetchSigner } from "@wagmi/core";
import { BigNumber } from "ethers";
import { defineStore, storeToRefs } from "pinia";
import { Web3Provider } from "zksync-web3";

import type { TokenAmount } from "@/types";
import type { BigNumberish } from "ethers";

import { useOnboardStore } from "@/store/onboard";
import { useEraProviderStore } from "@/store/zksync/era/provider";
import { useEraTokensStore } from "@/store/zksync/era/tokens";

export const useEraWalletStore = defineStore("eraWallet", () => {
  const onboardStore = useOnboardStore();
  const eraProviderStore = useEraProviderStore();
  const eraTokensStore = useEraTokensStore();
  const { eraNetwork } = storeToRefs(eraProviderStore);
  const { tokens } = storeToRefs(eraTokensStore);
  const { account, network } = storeToRefs(onboardStore);

  const { execute: getSigner, reset: resetSigner } = usePromise(async () => {
    const walletNetworkId = network.value.chain?.id;
    if (walletNetworkId !== eraNetwork.value.id) {
      throw new Error(
        `Incorrect wallet network selected: #${walletNetworkId} (expected: ${eraNetwork.value.name} #${eraNetwork.value.id})`
      );
    }

    const signer = await fetchSigner();
    if (!signer) throw new Error("Signer is not available");

    // TODO: Figure out a better way to create an Era signer
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const web3Provider = new Web3Provider(signer.provider.provider);
    const eraL2Signer = web3Provider.getSigner();
    return eraL2Signer;
  });

  const {
    result: balanceRaw,
    inProgress: balanceInProgress,
    error: balanceError,
    execute: requestBalance,
    reset: resetBalance,
  } = usePromise<{ [tokenAddress: string]: BigNumberish }>(
    async () => {
      await eraTokensStore.requestTokens();
      if (!tokens.value) throw new Error("Tokens are not available");

      if (!account.value.address) throw new Error("Account is not available");

      const provider = eraProviderStore.requestProvider();
      const balances = await Promise.all(
        Object.entries(tokens.value).map(async ([, token]) => {
          return {
            address: token.address,
            amount: (await provider.getBalance(onboardStore.account.address!, undefined, token.address)).toString(),
          };
        })
      );

      return balances.reduce((accumulator: { [tokenAddress: string]: BigNumberish }, { address, amount }) => {
        accumulator[address] = amount;
        return accumulator;
      }, {});
    },
    { cache: 30000 }
  );
  watch(
    balanceRaw,
    (balances) => {
      Object.entries(balances ?? {}).map(([tokenAddress, amount]) => {
        if (BigNumber.from(amount).isZero()) return;
        eraTokensStore.requestTokenPrice(tokenAddress);
      });
    },
    { immediate: true }
  );

  const balance = computed<TokenAmount[]>(() => {
    return Object.entries(tokens.value ?? {}).map(([, token]) => {
      const amount = balanceRaw.value?.[token.address] ?? "0";
      return { ...token, amount };
    });
  });
  const allBalancePricesLoaded = computed(
    () => !balance.value.some((e) => e.price === "loading") && !balanceInProgress.value
  );

  const isCorrectNetworkSet = computed(() => {
    const walletNetworkId = network.value.chain?.id;
    return walletNetworkId === eraNetwork.value.id;
  });
  const {
    inProgress: switchingNetworkInProgress,
    error: switchingNetworkError,
    execute: switchNetwork,
  } = usePromise(
    async () => {
      try {
        await onboardStore.switchNetworkById(eraNetwork.value.id, eraNetwork.value.name);
      } catch (err) {
        const error = formatError(err as Error);
        if (error) throw error;
      }
    },
    { cache: false }
  );
  const setCorrectNetwork = async () => {
    await switchNetwork().catch(() => undefined);
  };

  onboardStore.subscribeOnAccountChange(() => {
    resetSigner();
    resetBalance();
  });

  return {
    getSigner,

    balance,
    balanceInProgress: computed(() => balanceInProgress.value),
    balanceError: computed(() => balanceError.value),
    allBalancePricesLoaded,
    requestBalance,

    isCorrectNetworkSet,
    switchingNetworkInProgress,
    switchingNetworkError,
    setCorrectNetwork,
  };
});
