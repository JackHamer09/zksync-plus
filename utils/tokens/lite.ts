import liteTokenIcons from "@/assets/json/tokens/lite-tokens-icons.json";

type TokenIcons = {
  thumb: string;
  small: string;
  large: string;
};

export function getTokenIconUrlBySymbol(
  symbol: string,
  size: "thumb" | "small" | "large" = "small"
): string | undefined {
  if (symbol in liteTokenIcons) {
    return (liteTokenIcons as Record<string, TokenIcons>)[symbol][size];
  }
  return undefined;
}
