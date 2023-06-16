/* eslint-disable @typescript-eslint/no-explicit-any */
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { Helper } from "../helpers/helper";
import { BasePage } from "../pages/base.page";
import { LoginPage } from "../pages/login.page";
import { MainPage } from "../pages/main.page";
import { MetamaskPage } from "../pages/metamask.page";
import { TokensPage } from "../pages/tokens.page";
import { config } from "../support/config";

import type { ICustomWorld } from "../support/custom-world";

let basePage: BasePage;
let mainPage: MainPage;
let helper: Helper;
let result: any;
let element: any;

Given("I go to {string} url", config.stepTimeout, async function (this: ICustomWorld, url: string) {
  basePage = new BasePage(this);
  await basePage.goTo(url);
});

Given("I go to page {string}", config.stepTimeout, async function (this: ICustomWorld, route: string) {
  await this.page?.goto(config.BASE_URL + route);
});

When("I click by text {string}", config.stepTimeout, async function (this: ICustomWorld, text: string) {
  basePage = new BasePage(this);
  await basePage.clickByText(text);
});

When(
  "I click by {string} with {string} value",
  config.stepTimeout,
  async function (this: ICustomWorld, elementType: string, value: string) {
    basePage = new BasePage(this);
    await basePage.clickBy(elementType, value);
  }
);

When("Connect Metamask extension with login action", config.stepTimeout, async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this);

  await loginPage.connectMetamask();
});

When("Connect Metamask and press cancel button", config.stepTimeout, async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this);

  await loginPage.connectMetamaskWithCancel();
});

When(
  "I select {string} and go to {string} subsection",
  config.stepTimeout,
  async function (this: ICustomWorld /*, section: string, subSection: string*/) {
    // mainPage = new MainPage(this);
    // await mainPage.selectPortalSubsection(section, subSection);
  }
);

When(
  "I choose {string} as token and insert {string} as amount",
  config.stepTimeout,
  async function (this: ICustomWorld, token: string, amount: string) {
    mainPage = new MainPage(this);
    await mainPage.insertAmount(amount);
    await mainPage.chooseToken(token);

    // return await mainPage.skipTestIfFeeIsHigh(); //skip next steps, if fee is higher than expected
  }
);

When("I choose {string} as token", config.stepTimeout, async function (this: ICustomWorld, token: string) {
  mainPage = new MainPage(this);
  await mainPage.chooseToken(token);
});

When("I insert {string} as amount", config.stepTimeout, async function (this: ICustomWorld, amount: string) {
  mainPage = new MainPage(this);
  await mainPage.insertAmount(amount);
});

When(
  "Message {string} should be visible",
  { timeout: 181 * 1000 },
  async function (this: ICustomWorld, successMessage: string) {
    result = await this.page?.locator(`//*[text()='${successMessage}']`);
    await expect(result).toBeVisible({ timeout: 180 * 1000 });
  }
);

Then("Fee should have {string} value", config.stepTimeout, async function (this: ICustomWorld, fee: string) {
  mainPage = new MainPage(this);
  basePage = new BasePage(this);
  element = basePage.byTestId + mainPage.feeValue;
  result = await this.page?.locator(element);
  await expect(result).toContainText(fee);
});

Then("Fee field should have {string} value", config.stepTimeout, async function (this: ICustomWorld, fee: string) {
  mainPage = new MainPage(this);
  basePage = new BasePage(this);
  element = basePage.byTestId + mainPage.feeFieldValue;
  result = await this.page?.locator(element);
  await expect(result).toContainText(fee);
});

Then("Max amount is set", async function (this: ICustomWorld) {
  mainPage = new MainPage(this);
  basePage = new BasePage(this);
  const maxAmount = await mainPage.calculateMaxAmount();
  element = basePage.byTestId + mainPage.amountInputFieldValue;
  result = await this.page?.locator(element);
  await expect(result).toContainText(maxAmount);
});

Then("Get current fee amount", config.stepTimeout, async function (this: ICustomWorld) {
  mainPage = new MainPage(this);

  result = await mainPage.getFeeAmount();
  return result;
});

Then(
  "Current fee amount should be changed relatively to the previous one",
  config.stepTimeout,
  async function (this: ICustomWorld) {
    mainPage = new MainPage(this);
    const currentFee = await mainPage.getFeeAmount();
    const previousFee = result;

    if (currentFee !== previousFee) {
      result = true;
    }
    await expect(result).toBe(true);
  }
);

When(
  "I {string} transaction after clicking {string} button",
  config.stepTimeout,
  async function (this: ICustomWorld, actionType: string, transactionBtn: string) {
    mainPage = new MainPage(this);
    await mainPage.makeTransaction(actionType, transactionBtn);
  }
);

When(
  "I insert {string} as wallet address",
  config.stepTimeout,
  async function (this: ICustomWorld, walletAddress: string) {
    mainPage = new MainPage(this);
    await mainPage.insertWalletAddress(walletAddress);
  }
);

When(
  "I insert {string} as withdraw address",
  config.stepTimeout,
  async function (this: ICustomWorld, walletAddress: string) {
    mainPage = new MainPage(this);
    await mainPage.insertWithdrawAddress(walletAddress);
  }
);

When(
  "I insert {string} as deposit address",
  config.stepTimeout,
  async function (this: ICustomWorld, walletAddress: string) {
    mainPage = new MainPage(this);
    await mainPage.insertDepositAddress(walletAddress);
  }
);

Then(
  "Balance value should be {string}",
  config.stepTimeout,
  async function (this: ICustomWorld, expectedBalance: string) {
    mainPage = new MainPage(this);
    basePage = new BasePage(this);
    helper = new Helper(this);
    await mainPage.checkWalletBalance(expectedBalance);
  }
);

Then(
  "Element with {string} {string} should be {string}",
  config.stepTimeout,
  async function (this: ICustomWorld, elementType: string, value: string, checkType: string) {
    basePage = new BasePage(this);
    helper = new Helper(this);
    element = await basePage.returnElementByType(elementType, value);

    if (checkType === "visible") {
      await expect(element).toBeVisible();
    } else if (checkType === "invisible") {
      result = await helper.checkElementVisible(element);
      await expect(result).toBe(false);
    } else if (checkType === "clickable") {
      result = await helper.checkElementClickable(element);
      await expect(result).toBe(true);
    } else if (checkType === "disabled") {
      result = await element.isDisabled();
      await expect(result).toBe(true);
    } else if (checkType === "enabled") {
      result = await element.isDisabled();
      await expect(result).toBe(false);
    }
  }
);

Then(
  "Transaction button {string} should be {string}",
  config.stepTimeout,
  async function (this: ICustomWorld, value: string, state: string) {
    basePage = new BasePage(this);
    helper = new Helper(this);
    mainPage = new MainPage(this);
    result = await mainPage.getTransactionBtn(value);

    if (state == "visible") {
      await expect(result).toBeVisible();
    } else if (state == "disabled") {
      await expect(result).toBeDisabled();
    } else if (state == "clickable") {
      element = await helper.checkElementClickable(result);
      await expect(element).toBe(true);
    }
  }
);

When("I click {string} transaction button", config.stepTimeout, async function (this: ICustomWorld, value: string) {
  mainPage = new MainPage(this);
  element = await mainPage.getTransactionBtn(value);
  await element.click();
});

Given("I reset a nonce", config.stepTimeout, async function (this: ICustomWorld) {
  const metamaskPage = await new MetamaskPage(this);
  await metamaskPage.resetNonce();
});

Then(
  "I check input field with value {string} available in Metamask network settings",
  config.stepTimeout,
  async function (this: ICustomWorld, selector: string) {
    const metamaskPage = await new MetamaskPage(this);
    helper = new Helper(this);
    result = await metamaskPage.checkNetworkAttribute(selector);
    element = await helper.checkElementVisible(result);
    await expect(element).toBe(true);
  }
);

Then("New page have {string} address", config.stepTimeout, async function (this: ICustomWorld, url: string) {
  mainPage = new MainPage(this);
  helper = new Helper(this);
  await this.page?.waitForTimeout(5000);
  result = await helper.checkTabByUrl(url);
  await expect(result).toBe(url);
});

Then("New page includes {string} address", config.stepTimeout, async function (this: ICustomWorld, url: string) {
  mainPage = new MainPage(this);
  helper = new Helper(this);
  await this.page?.waitForTimeout(5000);
  result = await helper.checkTabByUrl(url, true);
  await expect(result).toContain(url);
});

Then("Current page have {string} address", config.stepTimeout, async function (this: ICustomWorld, route: string) {
  mainPage = new MainPage(this);
  helper = new Helper(this);
  await this.page?.waitForURL("**" + route);
  result = await this.page?.url();

  await expect(result).toContain(route);
});

Then("Log out from Portal", config.stepTimeout, async function (this: ICustomWorld) {
  const metamaskPage = await new MetamaskPage(this);
  await metamaskPage.logout();
});

Then("I am on login page", config.stepTimeout, async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this);
  await loginPage.logout();
});

Then("QR code is visible", config.stepTimeout, async function (this: ICustomWorld) {
  basePage = new BasePage(this);
  helper = new Helper(this);
  element = await basePage.returnElementByType("alt", "QR Code");
  await expect(element).toBeVisible();
});

Given("I click on dropdown submenu", config.stepTimeout, async function (this: ICustomWorld) {
  const mainPage = new MainPage(this);
  const basePage = new BasePage(this);

  await basePage.click(mainPage.dropDownSubMenu);
});

Then("My wallet is {string}", config.stepTimeout, async function (this: ICustomWorld, walletState: string) {
  const mainPage = new MainPage(this);

  await mainPage.getWalletBalancesState(walletState);
});

Then(
  "Toggle for {string} token should be visible",
  config.stepTimeout,
  async function (this: ICustomWorld, token: string) {
    const tokensPage = new TokensPage(this);
    element = await tokensPage.getTokenSwitcher(token);
    result = await this.page?.locator(element);

    await expect(result).toBeVisible();
  }
);

//Possible state is "on" and "off"
Then(
  "Toggle for {string} token should have {string} state",
  config.stepTimeout,
  async function (this: ICustomWorld, token: string, state: string) {
    const tokensPage = new TokensPage(this);
    element = await tokensPage.getTokenSwitcherState(token, state);
    result = await this.page?.locator(element);

    await expect(result).toBeVisible();
  }
);

Then("Balance label for current layer is shown", config.stepTimeout, async function (this: ICustomWorld) {
  mainPage = new MainPage(this);
  element = await mainPage.balanceLabel();
  result = await this.page?.locator(element);
  await expect(result).toBeVisible();
});

Given(
  "I fill the text field for {string} selector by {string} value",
  config.stepTimeout,
  async function (this: ICustomWorld, selector: string, text: string) {
    basePage = new BasePage(this);
    element = await basePage.getInputSelector(selector);

    await basePage.fill(element, text);
  }
);

Then(
  "I check input field with selector {string} to have text {string} value",
  config.stepTimeout,
  async function (this: ICustomWorld, selector: string, text: string) {
    basePage = new BasePage(this);
    element = await basePage.getInputSelector(selector);
    result = await this.page?.locator(element).inputValue();
    await expect(result).toBe(text);
  }
);

When("I press {string} button", config.stepTimeout, async function (this: ICustomWorld, buttonName: string) {
  basePage = new BasePage(this);
  await basePage.pressButton(buttonName);
});

When(
  "Check the {string} value is actual for {string} switcher",
  config.stepTimeout,
  async function (this: ICustomWorld, value: string, switcherType: string) {
    mainPage = new MainPage(this);
    await mainPage.verifyActualSwitcherValue(switcherType, value);
  }
);

When(
  "Check the {string} label is actual for {string} destination layer",
  config.stepTimeout,
  async function (this: ICustomWorld, value: string, layer: string) {
    mainPage = new MainPage(this);
    await mainPage.verifyActualLayerValue(layer, value);
  }
);

When(
  "Set the {string} value for {string} switcher",
  config.stepTimeout,
  async function (this: ICustomWorld, value: string, switcherType: string) {
    mainPage = new MainPage(this);
    await mainPage.setSwitcherValue(switcherType, value);
  }
);

When("Show the transaction number after success", { timeout: 90 * 1000 }, async function (this: ICustomWorld) {
  mainPage = new MainPage(this);
  await mainPage.showTxNumber();
});

When("Press the transaction link", config.stepTimeout, async function (this: ICustomWorld) {
  mainPage = new MainPage(this);
  await mainPage.clickOnTransactionLink();
});

When("Set {string} for offline mode", config.stepTimeout, async function (this: ICustomWorld, state: string) {
  mainPage = new MainPage(this);
  await mainPage.setOfflineMode(state);
});

Then(
  "Check metadata element {string} contains {string}",
  config.stepTimeout,
  async function (this: ICustomWorld, metaElement: string, expectedString: string) {
    mainPage = new MainPage(this);
    element = await this.page?.locator(`//*[contains(@property, '${metaElement}')]`);
    expect(element).toHaveAttribute("content", expectedString);
  }
);

When("I click Swap button", config.stepTimeout, async function (this: ICustomWorld) {
  mainPage = new MainPage(this);
  await mainPage.clickSwapButton();
});
