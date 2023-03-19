import { defineStore, storeToRefs } from "pinia";

import { connector, useOnboardStore } from "@/store/onboard";

export const useEthWalletStore = defineStore("ethWallet", () => {
  const onboardStore = useOnboardStore();
  const { account } = storeToRefs(onboardStore);

  const getEthWalletSigner = async () => {
    if (!account.value) throw new Error("Account is not available");
    if (!connector) throw new Error("Connector is not available");
    return await connector.getSigner();
  };

  return {
    getEthWalletSigner,
  };
});
