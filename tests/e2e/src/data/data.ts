export enum Extension {
  specifiedExtensionUrl = "chrome-extension://",
  allExtensionsUrl = "chrome://extensions/",
  metamaskHomeHtml = "/home.html",
  metamaskInitialize = "#initialize/welcome",
  metamaskAdvSettings = "#settings/advanced",
  metamaskNetworkSettings = "#settings/networks",
}

export enum NetworkSwitcher {
  zkSyncEraGoerli = "/?network=goerli",
  zkSyncEraMainnet = "/?network=mainnet",
}

export enum Routes {
  withdraw = "/transaction/zksync/era/withdraw",
}
