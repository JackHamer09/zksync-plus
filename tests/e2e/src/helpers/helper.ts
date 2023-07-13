/* eslint-disable @typescript-eslint/no-explicit-any */
import { Status } from "@cucumber/cucumber";
import crypto from "crypto";
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import https from "https";
import { Provider } from "zksync-web3";

import { MainPage } from "../pages/main.page";
import { config, wallet } from "../support/config";

import type { ICustomWorld } from "../support/custom-world";
import type { Pickle } from "@cucumber/messages";
const tracesDir = "./artifacts/";
const algorithm = "aes-256-cbc";
const key = Buffer.from(wallet.secret, "hex"); // crypto.randomBytes(32);
const iv = Buffer.from(wallet.salt, "hex"); //crypto.randomBytes(16);

let result: any;
let depositTag: boolean;
let withdrawTag: boolean;
let transferTag: boolean;
let authorizedTag: boolean;
let unauthorizedTag: boolean;
let emptyWalletTag: boolean;
let incognitoTag: boolean;
let transactionsTag: boolean;
let noBlockChain: boolean;
let wallet_1: string[];
let wallet_2: string[];
let wallet_0: string[];
let wallet_password: string;

export class Helper {
  world: ICustomWorld;

  constructor(world: ICustomWorld) {
    this.world = world;
  }

  async getNumberFromString(value: string) {
    const digitsMatcher = /\w*[.]\w*/i;
    const extractedString: any = await value.match(digitsMatcher);
    result = extractedString[0];

    return result;
  }

  async pressKey(keyName: string, count: number) {
    for (let i = 0; i < count; i++) {
      await this.world.page?.keyboard.press(keyName);
    }
  }

  async clearLocalStorage() {
    await this.world.page?.evaluate(() => window.localStorage.clear());
  }

  async decryptVars() {
    wallet_0 = (await this.decrypt(wallet._0_public_key)).split(" ");
    wallet_1 = (await this.decrypt(wallet._1_public_key)).split(" ");
    wallet_2 = (await this.decrypt(wallet._2_public_key)).split(" ");
    wallet_password = await this.decrypt(wallet.password);
  }

  async predefineTags(filteredTag: any) {
    depositTag = filteredTag("@deposit");
    transferTag = filteredTag("@transfer");
    withdrawTag = filteredTag("@withdraw");
    incognitoTag = filteredTag("@incognito");
    transactionsTag = filteredTag("@transactions");
    authorizedTag = filteredTag("@authorized");
    unauthorizedTag = filteredTag("@unauthorized");
    emptyWalletTag = filteredTag("@emptyWallet");
    noBlockChain = filteredTag("@noBlockChain");
  }

  async checkElementVisible(element: string, waitTime = 10000): Promise<boolean> {
    result = true;
    try {
      await this.world.page?.locator(element).waitFor({
        state: "visible",
        timeout: waitTime,
      });
    } catch {
      result = false;
    }
    return result;
  }

  async checkElementClickable(element: any, waitTime = 10000): Promise<boolean> {
    result = true;
    try {
      if (element == "string") {
        await this.world.page?.locator(element).click({ trial: true, timeout: waitTime });
      } else {
        await element.click({ trial: true, timeout: waitTime });
      }
    } catch (e) {
      console.error(e);
      result = false;
    }
    return result;
  }

  async getScreenshotOnFail(result: any): Promise<void> {
    if (result.status === Status.FAILED) {
      console.log("======== " + result.status + ": " + this.world.testName);
      const image: any = await this.world.page?.screenshot({ path: tracesDir + this.world.testName + ".png" });
      return image;
    } else if (result.status === Status.PASSED) {
      console.log(process.cwd());
      console.log("======== " + result.status + ": " + this.world.testName);
    } else if (result.status === Status.SKIPPED) {
      console.log("======== " + result.status + ": " + this.world.testName);
    }
  }

  async getTextFromLocator(locator: string) {
    result = await this.world.page?.locator(locator).textContent();
    return result;
  }

  async closeBrowserTabs(browserContext: any) {
    const pages = browserContext?.pages();
    for (let i = 0; i < pages.length - 1; i++) {
      //workaround for CI running
      await pages[i].close();
    }
  }

  async checkTabByUrl(url: string, partialUrl?: boolean) {
    const pages: any = this.world.context?.pages();
    const pagesLength = await pages.length;
    for (let i = 0; i < pagesLength; i++) {
      result = await pages[i].url();
      if (result === url) {
        return result;
      } else if (result.includes(url) && partialUrl === true) {
        return result;
      }
    }
  }
  async getBalanceETH(walletAddress: string, layer: string) {
    let network: any;
    let provider: any;
    if (layer == "L1") {
      network = config.networkL1;
      provider = ethers.getDefaultProvider(network);
    } else if (layer == "L2") {
      network = config.networkL2;
      provider = new Provider(network);
    } else {
      console.log(`Wrong layer: ${layer}`);
    }
    const balanceEth = Number(ethers.utils.formatEther(await provider.getBalance(walletAddress)));
    return balanceEth;
  }

  async thresholdBalanceIsOk() {
    const mainPage = new MainPage(this.world);
    if (depositTag && !noBlockChain) {
      await mainPage.monitorBalance(wallet._1, "L1");
    } else if (withdrawTag || transferTag) {
      await mainPage.monitorBalance(wallet._2, "L2");
    }
  }

  async notifyQAIfLowBalance(layer: string, walletAddress: string, currentBalance: number) {
    let preThresholdBalance = config.preThresholdBalance;
    if (transferTag) {
      //transfer transaction require less fee and less balance, it helps us to avoid double informing using transaction Tag
      preThresholdBalance = preThresholdBalance - preThresholdBalance * 0.1; // -10% from minimal balance of withdrawal transaction
    }
    if (currentBalance < preThresholdBalance) {
      dotenv.config();
      const data = JSON.stringify({
        text: layer + " balance of the wallet " + walletAddress + " is " + currentBalance + " ETH",
      });
      const options = {
        hostname: config.matterMostURL,
        port: 443,
        path: process.env.MMOSTQAHOOK,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length.toString(),
        },
      };
      const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on("data", (d) => {
          process.stdout.write(d);
        });
        res.on("error", (error) => {
          console.error(error);
        });
      });
      req.on("error", function (e) {
        console.error(e);
      });
      req.write(data);
      req.end();
    }
  }

  async decrypt(encryptedData: string) {
    const encryptedText = Buffer.from(encryptedData, "hex");

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  async metamaskAuthorization(metamaskPage: any, basePage: any, pickle: Pickle) {
    await this.decryptVars();
    const targetUrl = config.BASE_URL + config.DAPP_NETWORK;
    const tags = pickle.tags;
    const filteredTag = (tag: string) => tags.filter((i) => i.name.includes(tag)).length > 0;
    await this.predefineTags(filteredTag);
    if (!incognitoTag && !transactionsTag && !emptyWalletTag) {
      await metamaskPage.authorizeInMetamaskExtension(wallet_1, wallet_password);
      await basePage.goTo(targetUrl);
    } else if (transactionsTag && !incognitoTag) {
      const isLogout = await metamaskPage.isLogout();
      if (isLogout === undefined && depositTag) {
        // await this.thresholdBalanceIsOk();
        await metamaskPage.authorizeInMetamaskExtension(wallet_1, wallet_password); // L1 wallet
      } else if (isLogout === undefined && !depositTag) {
        // await this.thresholdBalanceIsOk();
        await metamaskPage.authorizeInMetamaskExtension(wallet_2, wallet_password); // L2 wallet
      }
      await basePage.goTo(targetUrl);
    } else if (emptyWalletTag) {
      await metamaskPage.authorizeInMetamaskExtension(wallet_0, wallet_password);
      await basePage.goTo(targetUrl);
    } else if (process.env.INCOGNITO_MODE === "true" && incognitoTag) {
      await basePage.goTo(targetUrl);
    }
  }

  async restoreEnvironment(metamaskPage: any, context: any) {
    if (!(await metamaskPage.isLogout()) && !transactionsTag && !incognitoTag && !authorizedTag) {
      await metamaskPage.logout();
    } else if (unauthorizedTag) {
      await this.clearLocalStorage();
      await context?.clearCookies();
    }
    await this.closeBrowserTabs(context);
  }

  async getClipboardValue() {
    result = await this.world.page?.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    return result;
  }

  async clearClipboard() {
    result = await this.world.page?.evaluate(async () => {
      return await navigator.clipboard.writeText("");
    });

    return result;
  }
}
