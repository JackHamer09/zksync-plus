import { BigNumber } from "ethers";

export function isBigNumber(value: unknown): boolean {
  return BigNumber.isBigNumber(value);
}

export const isValidAmount = (value: BigNumber) => {
  if (!isBigNumber(value)) {
    return false;
  }
  return value.gt(0);
};
