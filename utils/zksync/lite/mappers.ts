import { isNFT } from "zksync/build/utils";

import type { ZkSyncLiteToken } from "@/store/zksync/lite/tokens";
import type { ApiTransaction } from "zksync/build/types";

import { checksumAddress } from "@/utils/formatters";

type ZkSyncLiteTransactionToken =
  | {
      id: number;
      symbol: string;
      isNFT: true;
      contentHash: string;
      creator: {
        id: number;
        address: string;
      };
    }
  | (ZkSyncLiteToken & {
      isNFT: false;
    });

export function mapApiTransaction(transaction: ApiTransaction, tokens: ZkSyncLiteToken[]) {
  function getTokenBySymbolOrID(tokenIDorSymbol: number | string) {
    if (isNFT(tokenIDorSymbol)) {
      return {
        id: tokenIDorSymbol,
        symbol: `NFT-${tokenIDorSymbol}`,
        isNFT: true,
      };
    }
    if (typeof tokenIDorSymbol === "number") {
      for (const token of tokens) {
        if (token.id === tokenIDorSymbol) {
          return {
            ...token,
            isNFT: false,
          };
        }
      }
    } else if (typeof tokenIDorSymbol === "string") {
      for (const token of tokens) {
        if (token.symbol === tokenIDorSymbol) {
          return {
            ...token,
            isNFT: false,
          };
        }
      }
    }
  }

  /* TODO: Write proper types */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tx = transaction as any;

  const isNFTOperation = tx.op.type.includes("NFT") === true || (tx.op.token && isNFT(tx.op.token) === true);
  let from = tx.op.from;
  let to = tx.op.to || tx.op.recipient;
  if (tx.op.type === "MintNFT") {
    from = tx.op.creatorAddress;
  } else if (tx.op.type === "ChangePubKey" || tx.op.type === "Close") {
    from = tx.op.account;
    to = tx.op.account;
  } else if (tx.op.type === "ForcedExit") {
    to = tx.op.target;
  }
  const tokenIDorSymbol = typeof tx.op.token === "number" ? tx.op.token : tx.op.tokenId;
  const isTokenNFT = isNFT(tokenIDorSymbol);
  const feeToken = typeof tx.op.feeToken === "number" ? tx.op.feeToken : !isTokenNFT ? tokenIDorSymbol : undefined;
  const feeAmount = !tx.op.fee ? "0" : String(tx.op.fee);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let swapOrder1: any = undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let swapOrder2: any = undefined;
  if (tx.op.orders) {
    const order1 = tx.op.orders[0];
    const order2 = tx.op.orders[1];
    const order1Token = order1.tokenSell;
    const order2Token = order2.tokenSell;
    const isOrder1TokenNFT = isNFT(order1Token);
    const isOrder2TokenNFT = isNFT(order2Token);
    from = order1.recipient;
    to = order2.recipient;
    swapOrder1 = {
      address: order1.recipient ? checksumAddress(order1.recipient) : undefined,
      account: {
        id: order1.accountId,
        nonce: order1.nonce,
        pubKey: order1.signature?.pubKey,
      },
      token: <ZkSyncLiteTransactionToken>(isOrder1TokenNFT
        ? {
            ...getTokenBySymbolOrID(order1Token)!,
            contentHash: order1.contentHash,
            creator: {
              id: order1.creatorId,
              address: order1.creatorAddress ? checksumAddress(order1.creatorAddress) : undefined,
            },
          }
        : getTokenBySymbolOrID(order1Token)),
      amount: isOrder1TokenNFT ? 1 : order1.amount,
      signature: order1.signature?.signature,
      swapOrderETHSignatureType: order1.ethSignature?.type,
      swapOrderETHSignature: order1.ethSignature?.signature,
      validFrom: order1.validFrom,
      validUntil: order1.validUntil,
    };
    swapOrder2 = {
      address: order2.recipient ? checksumAddress(order2.recipient) : undefined,
      account: {
        id: order2.accountId,
        nonce: order2.nonce,
        pubKey: order2.signature?.pubKey,
      },
      token: <ZkSyncLiteTransactionToken>(isOrder2TokenNFT
        ? {
            ...getTokenBySymbolOrID(order2Token)!,
            contentHash: order2.contentHash,
            creator: {
              id: order2.creatorId,
              address: order2.creatorAddress ? checksumAddress(order2.creatorAddress) : undefined,
            },
          }
        : getTokenBySymbolOrID(order2Token)),
      amount: isOrder2TokenNFT ? 1 : order2.amount,
      signature: order2.signature?.signature,
      swapOrderETHSignatureType: order2.ethSignature?.type,
      swapOrderETHSignature: order2.ethSignature?.signature,
      validFrom: order2.validFrom,
      validUntil: order2.validUntil,
    };
  }

  return {
    createdAt: tx.createdAt as ApiTransaction["createdAt"],
    txHash: tx.op.type === "Deposit" ? tx.op.ethHash : (tx.txHash as string),
    ethTxHash: tx.op.type === "Deposit" ? tx.txHash : (tx.op.ethHash as string),
    status: tx.status as ApiTransaction["status"],
    type: tx.op.type,
    failReason: tx.failReason,
    isNFTOperation: isNFTOperation ? true : false,
    isFeeTransaction: (tx.op.type === "Transfer" &&
      from === to &&
      (tx.batchId ?? false) &&
      tx.op.amount === "0") as boolean,
    account: {
      id: tx.op.accountId,
      nonce: tx.op.nonce,
      newPkHash: tx.op.newPkHash,
      pubKey: tx.op.signature?.pubKey,
    },
    batch: {
      id: tx.batchId,
    },
    block: {
      number: tx.blockNumber,
      index: tx.blockIndex,
    },
    from: from ? checksumAddress(from) : undefined,
    to: to ? checksumAddress(to) : undefined,
    token: <ZkSyncLiteTransactionToken | undefined>(isTokenNFT
      ? {
          ...getTokenBySymbolOrID(tokenIDorSymbol)!,
          contentHash: tx.op.contentHash,
          creator: {
            id: tx.op.creatorId,
            address: tx.op.creatorAddress ? checksumAddress(tx.op.creatorAddress) : undefined,
          },
        }
      : getTokenBySymbolOrID(tokenIDorSymbol)),
    amount: isTokenNFT || tx.op.type === "MintNFT" ? 1 : tx.op.amount,
    feeToken: <ZkSyncLiteTransactionToken>getTokenBySymbolOrID(feeToken),
    feeAmount: feeAmount,
    swap: {
      sending: swapOrder1,
      receiving: swapOrder2,
      submitter: {
        id: tx.op.submitterId,
        address: tx.op.submitterAddress,
      },
    },
    signature: tx.op.signature?.signature,
  };
}
export type ZkSyncLiteTransaction = ReturnType<typeof mapApiTransaction>;
