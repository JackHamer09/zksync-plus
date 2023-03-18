import { utils } from "ethers";

import liteTestnetToMainnetTokenAddress from "@/assets/json/lite-testnet-to-mainnet-token-address.json";

export function testnetToMainnetTokenAddress(testnetAddress: string, networkID: number): string | undefined {
  const address = (liteTestnetToMainnetTokenAddress as Record<string, Record<string, string>>)[networkID.toString()]?.[
    testnetAddress
  ];
  if (address) {
    return utils.getAddress(address);
  }
  return address;
}
