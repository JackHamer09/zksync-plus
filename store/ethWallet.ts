import { defineStore, storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";

export const useEthWalletStore = defineStore("ethWallet", () => {
  const onboardStore = useOnboardStore();
  const { account } = storeToRefs(onboardStore);

  const getEthWalletSigner = async () => {
    if (!account.value) throw new Error("Account is not available");
    return await onboardStore.getSigner();
  };

  return {
    getEthWalletSigner,
  };
});
