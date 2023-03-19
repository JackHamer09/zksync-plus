/* This is a standalone program to parse token icons */
import { $fetch } from "ohmyfetch";
import { getDefaultRestProvider } from "zksync";

import liteTokenIcons from "@/assets/json/tokens/lite-tokens-icons.json";
import preferedCoingeckoIds from "@/assets/json/tokens/preferred-coingecko-ids.json";

const getTokenInfo = async (
  tokenCoingeckoID: string
): Promise<{
  id: string;
  symbol: string;
  name: string;
  categories: string[];
  description: Record<string, string>;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
}> => {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${tokenCoingeckoID}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`;
    return await $fetch(url);
  } catch (error) {
    console.error(`Failed to fetch token info for id "${tokenCoingeckoID}"`);
    throw error;
  }
};

type Token = { id: string; symbol: string; name: string };

export default async () => {
  const coingeckoTokens: {
    id: string;
    symbol: string;
    name: string;
  }[] = await $fetch("https://api.coingecko.com/api/v3/coins/list");
  console.log(`Fetched ${coingeckoTokens.length} tokens from coingecko`);
  const coingeckoTokensBySymbol = coingeckoTokens.reduce((acc, token) => {
    if (!acc[token.symbol]) acc[token.symbol] = [];
    acc[token.symbol].push(token);
    return acc;
  }, {} as Record<string, Token[]>);

  const zkSyncProvider = await getDefaultRestProvider("mainnet");
  const tokens = await zkSyncProvider.getTokens();
  console.log(`Fetched ${Object.keys(tokens).length} tokens from zkSync`);
  const tokenSymbolToImage = {} as Record<
    string,
    {
      thumb: string;
      small: string;
      large: string;
    }
  >;
  const multipleTokensForSingleSymbol: Record<
    string,
    { symbol: string; address: string; etherscanURL: string; coingeckoVariants: Token[] }
  > = {};
  const notFoundTokenSymbols: Record<string, { symbol: string; address: string; etherscanURL: string }> = {};
  let counter = 0;
  try {
    for (const tokenSymbol in tokens) {
      if (tokenSymbol in liteTokenIcons) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tokenSymbolToImage[tokenSymbol] = (liteTokenIcons as any)[tokenSymbol];
        console.log(`Retrieved "${tokenSymbol}" from json. ${++counter} / ${Object.keys(tokens).length}`);
        continue;
      }
      if (/^ERC20-\d+$/i.test(tokenSymbol)) {
        console.warn(`Token "${tokenSymbol}" has no proper symbol. ${++counter} / ${Object.keys(tokens).length}`);
        continue;
      }
      const lowercaseTokenSymbol = tokenSymbol.toLowerCase();
      let coingeckoTokens = coingeckoTokensBySymbol[lowercaseTokenSymbol];
      if (!coingeckoTokens) {
        console.error(`No coingecko token found for "${tokenSymbol}". ${++counter} / ${Object.keys(tokens).length}`);
        notFoundTokenSymbols[tokenSymbol] = {
          symbol: tokenSymbol,
          address: tokens[tokenSymbol].address,
          etherscanURL: `https://etherscan.io/token/${tokens[tokenSymbol].address}`,
        };
        continue;
      }
      if (coingeckoTokens.length > 1) {
        console.log(`Multiple tokens found for "${tokenSymbol}"`);
        if (!Object.prototype.hasOwnProperty.call(preferedCoingeckoIds, tokenSymbol)) {
          console.error(`Add preferred id for "${tokenSymbol}" manually. ${++counter} / ${Object.keys(tokens).length}`);
          multipleTokensForSingleSymbol[tokenSymbol] = {
            symbol: tokenSymbol,
            address: tokens[tokenSymbol].address,
            etherscanURL: `https://etherscan.io/token/${tokens[tokenSymbol].address}`,
            coingeckoVariants: coingeckoTokens,
          };
          continue;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const preferredId = (preferedCoingeckoIds as any)[tokenSymbol];
        const foundToken = coingeckoTokens.find((token) => token.id === preferredId);
        if (!foundToken) {
          console.error(
            `Preferred id "${preferredId}" not found in coingecko tokens list. ${++counter} / ${
              Object.keys(tokens).length
            }`
          );
          notFoundTokenSymbols[tokenSymbol] = {
            symbol: tokenSymbol,
            address: tokens[tokenSymbol].address,
            etherscanURL: `https://etherscan.io/token/${tokens[tokenSymbol].address}`,
          };
          continue;
        }
        console.log(`Found token "${tokenSymbol}" by preferred id "${preferredId}"`);
        coingeckoTokens = [foundToken];
      }
      const coingeckoToken = coingeckoTokens[0];
      console.log(`Fetching coingecko token info for "${tokenSymbol}"`);
      const tokenInfo = await getTokenInfo(coingeckoToken.id);
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 9000));
      const tokenImage = tokenInfo.image;
      if (!tokenImage) {
        console.error(
          `No token image found for coingecko "${tokenSymbol}". ${++counter} / ${Object.keys(tokens).length}`
        );
        continue;
      }
      tokenSymbolToImage[tokenSymbol] = tokenImage;
      console.log(`Added token image for "${tokenSymbol}". ${++counter} / ${Object.keys(tokens).length}`);
    }
  } catch (error) {
    console.error(error);
  }
  console.log("\n\nResults:", tokenSymbolToImage);
  console.log("Duplicate tokens:", multipleTokensForSingleSymbol);
  console.log("Not found tokens:", notFoundTokenSymbols);
};
