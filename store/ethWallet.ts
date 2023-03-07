import { account, connector } from "@/store/onboard";

export const getEthWalletSigner = async () => {
  if (!account.value) throw new Error("Account is not available");
  if (!connector) throw new Error("Connector is not available");
  return await connector.getSigner();
};
