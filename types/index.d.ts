export type TokenPrice = number | "loading" | undefined;
export type Token = {
  l1Address?: string;
  address: string;
  symbol: string;
  decimals: number;
  iconUrl?: string;
  enabledForFees: boolean;
  price: TokenPrice;
};
export type TokenAmount = Token & { amount: BigNumberish };
