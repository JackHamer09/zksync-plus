import { BigNumber } from "ethers";

export function isBigNumber(value: unknown): boolean {
  try {
    return BigNumber.isBigNumber(BigNumber.from(value));
  } catch (error) {
    return false;
  }
}

export const isValidAmount = (value: BigNumber) => {
  if (!isBigNumber(value)) {
    return false;
  }
  return value.gt(0);
};
