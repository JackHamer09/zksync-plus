import type { IncomingTxFeeType } from "zksync/build/types";

export const isTransactionFeePayedSeparately = (
  params: { type: IncomingTxFeeType; symbol: string }[],
  feeSymbol: string
) => {
  return params.length > 1 || typeof params[0].type !== "string" || params[0].symbol !== feeSymbol;
};
