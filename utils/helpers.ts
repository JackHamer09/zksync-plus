import { BigNumber } from "ethers";

import type { ExtendedChain } from "@/store/network";
import type { BigNumberish } from "ethers";

export function generateAvatarColors(address: string) {
  const seedArr = address.match(/.{1,7}/g)?.splice(0, 5);
  const colors: string[] = [];

  seedArr?.forEach((seed) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }

    const rgb = [0, 0, 0];
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 255;
      rgb[i] = value;
    }
    colors.push(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
  });
  return colors;
}

export function isOnlyZeroes(value: string) {
  return value.replace(/0/g, "").replace(/\./g, "").length === 0;
}

export function calculateFee(gasLimit: BigNumberish, gasPrice: BigNumberish) {
  return BigNumber.from(gasLimit).mul(gasPrice);
}

export const getNetworkUrl = (network: ExtendedChain, routePath: string) => {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || !network.hostnames?.length) {
    return `${routePath}?network=${network.network}`;
  }
  return network.hostnames[0] + routePath;
};
