import { formatUnits } from "ethers/lib/utils.js";

import type { BigNumberish } from "ethers";

export function shortenAddress(address: string, chars = 3): string {
  return `${address.slice(0, chars + 4)}...${address.slice(-3)}`;
}

export function parseTokenAmount(amount: BigNumberish, decimals: number): string {
  const result = formatUnits(amount.toString(), decimals).toString();
  if (result.endsWith(".0")) {
    return result.slice(0, -2);
  }
  return result;
}

export function formatTokenPrice(amount: BigNumberish, decimals: number, price: number): string {
  const tokenAmount = parseTokenAmount(amount, decimals);
  const totalPrice = parseFloat(tokenAmount) * price;
  if (!totalPrice) {
    return "$0.00";
  } else if (totalPrice < 0.01) {
    return "<$0.01";
  }
  return "$" + totalPrice.toFixed(2);
}

export function removeSmallAmount(
  amount: BigNumberish,
  decimals: number,
  price: number,
  minTokenValue = 0.0001,
  maxChars = 6
): string {
  const tokenAmount = parseTokenAmount(amount, decimals);
  // eslint-disable-next-line prefer-const
  let [whole, fractional] = tokenAmount.split(".");
  if (!fractional) {
    fractional = "0";
  }
  if (whole.length > maxChars) {
    return whole;
  }

  let acc = whole + ".";
  for (let a = 0; a < fractional.length; a++) {
    const currentDecimalAmount = "0." + "".padEnd(a, "0") + "9";
    const currentPrice = parseFloat(currentDecimalAmount) * price;
    if (currentPrice >= minTokenValue || acc.length + 1 < maxChars) {
      acc += fractional[a];
    } else {
      break;
    }
  }
  if (acc.endsWith(".0")) {
    return acc.slice(0, -2);
  }
  return acc;
}
