import { account } from "@/store/onboard";

export const getEthWalletSigner = async () => {
  if (!account.value) throw new Error("Account is not available");
  if (!account.value.connector) throw new Error("Connector is not available");
  return await account.value.connector.getSigner();
};
