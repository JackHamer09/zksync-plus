import { formatUnits, getAddress, parseUnits } from "ethers/lib/utils";

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

export function decimalToBigNumber(amount: string, decimals: number) {
  return parseUnits(amount, decimals);
}

export function formatRawTokenPrice(amount: BigNumberish, decimals: number, price: number): number {
  const tokenAmount = parseTokenAmount(amount, decimals);
  return parseFloat(tokenAmount) * price;
}
export function formatPricePretty(price: number): string {
  if (!price) {
    return "$0.00";
  } else if (price < 0.01) {
    return "<$0.01";
  }
  return "$" + price.toFixed(2);
}
export function formatTokenPrice(amount: BigNumberish, decimals: number, price: number): string {
  return formatPricePretty(formatRawTokenPrice(amount, decimals, price));
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

export function checksumAddress(address: string) {
  return getAddress(address);
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function formatError(error?: Error) {
  const message = error?.message;
  if (typeof message === "string") {
    if (
      message.includes("User denied") ||
      message.includes("User rejected") ||
      message.includes("Rejected by user") ||
      message.includes('"Request rejected"')
    ) {
      return undefined;
    } else if (message.toLowerCase().includes("fee is to low")) {
      return new Error("Transaction fee was to low. Try again.");
    }
  }
  return error;
}
