import { fetchSigner } from "@wagmi/core";
import { Contract } from "ethers";
import { IERC20_INTERFACE } from "zksync/build/utils";

import type { BigNumber, BigNumberish, ContractInterface, ContractTransaction } from "ethers";
import type { Ref } from "vue";

import { ETH_ADDRESS } from "@/utils/constants";

export default (
  accountAddress: Ref<string | undefined>,
  tokenAddress: Ref<string | undefined>,
  getContractAddress: () => Promise<string | undefined>
) => {
  const getContractInstance = async () => {
    if (!tokenAddress.value) throw new Error("Token is not available");

    const signer = await fetchSigner();
    if (!signer) throw new Error("Signer is not available");

    return new Contract(tokenAddress.value, IERC20_INTERFACE as ContractInterface, signer);
  };

  const {
    result,
    inProgress,
    error,
    execute: getAllowance,
    reset,
  } = usePromise(
    async () => {
      if (!accountAddress.value) throw new Error("Account address is not available");

      const contractAddress = await getContractAddress();
      if (!contractAddress) throw new Error("Contract address is not available");

      const erc20contract = await getContractInstance();
      return (await erc20contract.allowance(accountAddress.value, contractAddress)) as BigNumber;
    },
    { cache: false }
  );

  const setAllowance = async (amount: BigNumberish) => {
    if (!accountAddress.value) throw new Error("Account address is not available");

    const contractAddress = await getContractAddress();
    if (!contractAddress) throw new Error("Contract address is not available");

    const erc20contract = await getContractInstance();
    return (await erc20contract.approve(contractAddress, amount)) as ContractTransaction;
  };

  const requestAllowance = async () => {
    if (accountAddress.value && tokenAddress.value && tokenAddress.value !== ETH_ADDRESS) {
      await getAllowance();
    } else {
      reset();
    }
  };

  watch(
    [accountAddress, tokenAddress],
    () => {
      requestAllowance();
    },
    { immediate: true }
  );

  return {
    result: computed(() => result.value),
    inProgress: computed(() => inProgress.value),
    error: computed(() => error.value),
    requestAllowance,

    setAllowance,
  };
};
