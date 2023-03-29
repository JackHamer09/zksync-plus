import { useStorage } from "@vueuse/core";
import { getAddress, isAddress } from "ethers/lib/utils";
import { defineStore, storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";

export type Version = "lite" | "era";

export const usePreferencesStore = defineStore("preferences", () => {
  const { account } = storeToRefs(useOnboardStore());

  const version = useStorage<"lite" | "era">("version", "lite");
  const lastTransactionAddress = useStorage<{ [userAddress: string]: string }>("last-transaction-address", {});

  return {
    version: computed(() => version.value),
    lastTransactionAddress: computed(() => {
      if (!account.value.address) {
        return null;
      }
      const lastAddress = lastTransactionAddress.value[account.value.address];
      if (isAddress(lastAddress)) {
        return getAddress(lastAddress);
      }
      return null;
    }),
  };
});
