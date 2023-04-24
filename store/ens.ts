import { computed } from "vue";

import { defineStore, storeToRefs } from "pinia";

import { useOnboardStore } from "@/store/onboard";

export const useEnsStore = defineStore("ens", () => {
  const onboardStore = useOnboardStore();
  const { ens } = onboardStore;
  const { account } = storeToRefs(onboardStore);

  const ensName = ref<string | null>(null);
  const ensAvatar = ref<string | null>(null);

  const fetchName = async () => {
    ensName.value = null;
    ensAvatar.value = null;

    if (!account.value.address) {
      return;
    }

    const initialAddress = account.value.address;
    const [name, avatar] = await Promise.all([
      ens.fetchEnsName({ address: account.value.address, chainId: 1 }),
      ens.fetchEnsAvatar({ address: account.value.address, chainId: 1 }),
    ]);
    if (account.value.address === initialAddress) {
      ensName.value = name;
      ensAvatar.value = avatar;
    }
  };

  fetchName();
  watch(() => account.value.address, fetchName);

  return {
    name: computed(() => ensName.value),
    avatar: computed(() => ensAvatar.value),
  };
});
