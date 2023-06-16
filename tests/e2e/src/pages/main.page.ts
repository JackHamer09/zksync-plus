/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "@playwright/test";

import { BasePage } from "./base.page";
import { MetamaskPage } from "./metamask.page";
import { Helper } from "../helpers/helper";
import { config } from "../support/config";

import elementsId from "../../utils/elementsId.json";

import type { ICustomWorld } from "../support/custom-world";

let basePage: any;
let metamaskPage: any;
let element: any;
let result: any;

export class MainPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  get balanceAmount() {
    return elementsId.balanceInfo.balanceAmount;
  }

  get tokenBalanceAmount() {
    return elementsId.amount.balance;
  }

  get balanceDecimalValue() {
    return elementsId.balanceInfo.balanceDecimal;
  }

  get tokenBalanceHoverAmount() {
    return ".tooltip-container";
  }

  get dropDownSubMenu() {
    return "#dropdown-menu";
  }

  get walletSection() {
    return elementsId.nav.menu.wallet;
  }

  get bridgeSection() {
    return elementsId.nav.menu.bridge;
  }

  get faucetSection() {
    return elementsId.nav.menu.faucet;
  }

  get transferSubSection() {
    return elementsId.nav.menu.faucet;
  }

  get receiveSubSection() {
    return elementsId.nav.wallet.transfer;
  }

  get depositSubSection() {
    return elementsId.nav.bridge.deposit;
  }

  get transactionNumber() {
    return ".actual-string";
  }

  get receiptComponent() {
    return "//span[@title]";
  }

  get amountInputField() {
    return "//*[@class='amount-input-field-container']//input";
  }

  get amountInputFieldValue() {
    return elementsId.amount.fieldValue;
  }

  get tokenDropDown() {
    return "token-dropDown";
  }

  get copyAddressBtn() {
    return "#headlessui-menu-button-18";
  }

  get walletAddressField() {
    return "#address";
  }

  get withdrawAddressField() {
    return elementsId.address.inputField;
  }

  get depositAddressField() {
    return elementsId.address.depositInputField;
  }

  get feeValue() {
    return elementsId.fee.value;
  }

  get feeFieldValue() {
    return elementsId.fee.field;
  }

  get selectedNetwork() {
    return ".network-item-label";
  }

  get selectedLanguage() {
    return ".selected-language-label";
  }

  get swapButton() {
    return "//*[@class='swap-button']";
  }

  get fromLayerLabel() {
    return "//div[@class='balance-field-label']";
  }

  get toLayerLabel() {
    return "//div[@class='balance-info-title']";
  }

  get getFirstToken() {
    return "//button[@l1address]";
  }

  async setSwitcherLanguage(languageOption: string) {
    return `//li[@class='language-list-item']//*[text()='${languageOption}']`;
  }

  async setSwitcherNetwork(networkOption: string) {
    return `//a[@class='network-list-item']//*[contains(text(), '${networkOption}')]`;
  }

  get listNetwork() {
    return ".network-list";
  }

  async balanceLabel() {
    return `//div[@class='token-balance']//*[text()='Balance:']`;
  }

  async getTokenItem(tokenItem: string) {
    element = `${tokenItem}`;
    return await element;
  }

  async selectPortalSubsection(section: string, subSection: string) {
    element = (text: string) => `//*[not(self::title)][contains(text(),'${text}')]`;
    try {
      await this.world.page?.waitForSelector(element(section));
      await this.clickByText(section);
      await this.world.page?.waitForSelector(element(subSection));
      await this.clickByText(subSection);
    } catch (e) {
      console.error(e);
    }
  }

  async chooseToken(tokenName: string) {
    // const helper = new Helper(this.world);
    // await helper.checkElementClickable(this.tokenDropDown);
    // await this.world.page?.locator(this.tokenDropDown).waitFor({state: "visible", timeout: 10000});
    await this.click(this.tokenDropDown, true);
    await this.clickBy("placeholder", "Symbol or address");
    await this.fill(".small-input-field", `${tokenName}`);
    await this.click(this.getFirstToken);
  }

  async insertAmount(amount: string) {
    await this.fill(this.amountInputField, amount);
  }

  async makeTransaction(actionType: string, transactionType: string) {
    metamaskPage = await new MetamaskPage(this.world);
    result = await this.getTransactionSelector(transactionType);

    await metamaskPage.operateTransaction(result, actionType);
  }

  async getTransactionBtn(transactionType: string) {
    basePage = await new BasePage(this.world);
    element = await this.getTransactionSelector(transactionType);
    result = await this.world.page?.locator(basePage.byTestId + element);
    return result;
  }

  async getTransactionSelector(transactionType: string) {
    result = transactionType;
    return result;
  }

  async insertWalletAddress(address: string) {
    await this.fill(this.walletAddressField, address);
  }

  async insertWithdrawAddress(address: string) {
    await this.fill(this.withdrawAddressField, address, true);
  }

  async insertDepositAddress(address: string) {
    await this.fill(this.depositAddressField, address, true);
  }

  async selectNetwork(expectedNetwork: string) {
    basePage = new BasePage(this.world);
    element = await this.world.page?.locator(this.selectedNetwork);
    const currentNetwork: any = await element.textContent();
    if (expectedNetwork !== currentNetwork) {
      await element.click();
      await this.world.page?.locator(this.listNetwork, { hasText: expectedNetwork }).click();
    }
    console.log("-------- Current network: ", currentNetwork);
    await expect(currentNetwork).toBe(expectedNetwork);
  }

  async getWalletBalancesState(walletState: string) {
    const balanceValue: any = await this.world.page?.locator(this.byTestId + this.balanceAmount).textContent();
    result = parseInt(balanceValue);

    if (walletState === "filled") {
      await expect(result).toBeGreaterThan(0);
    } else if (walletState === "empty") {
      await expect(result).toBeLessThan(0.01);
    } else {
      console.error("Incorrect wallet state has been provided");
    }
  }

  async checkWalletBalance(expectedBalance: string) {
    const helper = await new Helper(this.world);

    const intPart: any = await helper.getTextFromLocator(this.byTestId + this.balanceAmount);
    const floatPart: any = await helper.getTextFromLocator(this.byTestId + this.balanceDecimalValue);

    if (typeof intPart === "string" && typeof floatPart === "string" && intPart !== "" && floatPart !== "") {
      const actualBalance: string = intPart + floatPart;
      await expect(expectedBalance).toBe(actualBalance);
    } else {
      console.error(
        "Instead of locator text -> found:" + "Int part of balance: " + intPart + " Float part of balamce:" + floatPart
      );
    }
  }

  async verifyActualSwitcherValue(switcherType: string, expectedValue: string) {
    const actualValue = async (selector: string) => {
      element = await this.world.page?.locator(selector);
      return element;
    };

    if (switcherType === "language") {
      result = await actualValue(this.selectedLanguage);
    } else if (switcherType === "network") {
      result = await actualValue(this.selectedNetwork);
    } else {
      console.error("Incorrect value for switcher type");
    }
    await expect(result).toBeVisible({ timeout: 30 * 1000 });
    await expect(result).toHaveText(expectedValue);
  }

  async verifyActualLayerValue(layer: string, expectedValue: string) {
    const actualValue = async (selector: string) => {
      element = await this.world.page?.locator(selector);
      return element;
    };

    if (layer === "from") {
      result = await actualValue(this.fromLayerLabel);
    } else if (layer === "to") {
      result = await actualValue(this.toLayerLabel);
    } else {
      console.error("Incorrect value for network");
    }
    await expect(result).toHaveText(expectedValue);
    await expect(result).toBeVisible();
  }

  async setSwitcherValue(switcherType: string, value: string) {
    const switcherDropdown = async (selector: string) => {
      element = await this.world.page?.locator(selector);
      return element.click(config.increasedTimeout);
    };
    if (switcherType === "language") {
      await switcherDropdown(this.selectedLanguage);
      result = await switcherDropdown(await this.setSwitcherLanguage(value));
    } else if (switcherType === "network") {
      await switcherDropdown(this.selectedNetwork);
      result = await switcherDropdown(await this.setSwitcherNetwork(value));
    } else {
      console.error("Incorrect value for switcher type");
    }
  }

  async showTxNumber() {
    await this.world.page?.locator(this.receiptComponent).isVisible({ timeout: 60 * 1000 });
    element = await this.world.page?.locator(this.transactionNumber);
    result = await element.textContent();

    console.log("The transaction number: ", result);
  }

  async clickOnTransactionLink() {
    const selector = "transaction-receipt-link-";
    element = await this.getElementByPartialTestId(selector);

    await element.click(config.increasedTimeout);
  }

  async skipTestIfFeeIsHigh() {
    if (config.feeLimitations === true) {
      result = await this.getFeeAmount();
      if (result > config.feeBoundaryLevel) {
        console.warn("The fee amount is higher than it expected: ", result, " ETH");
        return "skipped";
      }
    }
  }

  async getFeeAmount() {
    const helper = await new Helper(this.world);

    element = await this.world.page?.locator(this.byTestId + this.feeValue);
    await element.isVisible(config.increasedTimeout);
    const feeAmount = await element.textContent();
    result = await helper.getNumberFromString(feeAmount);

    return result;
  }

  async setOfflineMode(state: string) {
    const isTrueSet = state == "true";
    await this.world.context?.setOffline(isTrueSet);
  }

  async getTokenAmount() {
    const helper = await new Helper(this.world);

    element = await this.world.page?.locator(this.byTestId + this.tokenBalanceAmount);
    await element.isVisible(config.increasedTimeout);
    await this.world.page?.hover(this.byTestId + this.tokenBalanceAmount);
    const hoverNumber: any = await this.world.page?.locator(this.tokenBalanceHoverAmount);
    const tokenAmount = await hoverNumber.textContent();
    result = await helper.getNumberFromString(tokenAmount);

    return result;
  }

  async calculateMaxAmount() {
    const maxValue = await this.getTokenAmount();
    const fee = await this.getFeeAmount();
    result = (maxValue - fee).toString().substring(0, result.length - 4);
    return result;
  }

  async clickSwapButton() {
    element = this.swapButton;
    await this.click(element);
  }
  async checkBalance(walletAddress: string, layer: string) {
    const helper = await new Helper(this.world);
    const balanceETH = await helper.getBalanceETH(walletAddress, layer);
    await helper.notifyQAIfLowBalance(layer, walletAddress, balanceETH);
    console.log("======== " + layer + " balance: " + balanceETH + " ETH | " + walletAddress);
    await expect(balanceETH).toBeGreaterThan(config.thresholdBalance);
  }
}
