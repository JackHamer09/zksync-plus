/* eslint-disable @typescript-eslint/no-explicit-any */
import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { NetworkSwitcher } from "../data/data";
import { Helper } from "../helpers/helper";
import { BasePage } from "../pages/base.page";
import { ContactsPage } from "../pages/contacts.page";
import { LoginPage } from "../pages/login.page";
import { MainPage } from "../pages/main.page";
import { MetamaskPage } from "../pages/metamask.page";
import { config } from "../support/config";

import type { ICustomWorld } from "../support/custom-world";

let basePage: BasePage;
let mainPage: MainPage;
let loginPage: LoginPage;
let metamaskPage: MetamaskPage;
let contactsPage: ContactsPage;
let helper: Helper;
let result: any;
let element: any;

Given("I go to {string} url", config.stepTimeout, async function (this: ICustomWorld, url: string) {
  basePage = new BasePage(this);
  await basePage.goTo(url);
});

Given("I go to page {string}", config.stepTimeout, async function (this: ICustomWorld, route: string) {
  await this.page?.waitForLoadState("load", { timeout: 3 * 1000 });
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

When(
  "I go to {string} transaction section",
  config.stepTimeout,
  async function (this: ICustomWorld, transactionType: string) {
    mainPage = new MainPage(this);
    await mainPage.selectTransaction(transactionType);
  }
);

When(
  "I choose {string} as token and insert {string} as amount",
  config.stepTimeout,
  async function (this: ICustomWorld, token: string, amount: string) {
    mainPage = new MainPage(this);
    await mainPage.chooseToken(token);
    await mainPage.insertAmount(amount);
  }
);

When(
  "Message {string} should be visible",
  { timeout: 181 * 1000 },
  async function (this: ICustomWorld, successMessage: string) {
    result = await this.page?.locator(`//*[text()="${successMessage}"]`).first();
    await expect(result).toBeVisible({ timeout: 180 * 1000 });
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

Then(
  "Element with {string} {string} should be {string}",
  config.stepTimeout,
  async function (this: ICustomWorld, elementType: string, value: string, checkType: string) {
    basePage = new BasePage(this);

    await basePage.verifyElement(elementType, value, checkType);
  }
);

When("I insert {string} as amount", config.stepTimeout, async function (this: ICustomWorld, amount: string) {
  mainPage = new MainPage(this);
  await mainPage.insertAmount(amount);
});

When("I confirm the network switching", config.stepTimeout, async function (this: ICustomWorld) {
  metamaskPage = new MetamaskPage(this);
  await metamaskPage.switchNetwork();
});

When("A wallet should be {string}", config.stepTimeout, async function (this: ICustomWorld, balanceValue: string) {
  mainPage = new MainPage(this);
  result = await mainPage.getTotalBalance();

  if (balanceValue === "fullfilled") {
    await expect(result).toBeGreaterThan(0.1);
  } else if (balanceValue === "empty") {
    await expect(result).toBeLessThanOrEqual(0);
  } else {
    console.log("An incorrect value has been provided as a parameter: the correct ones only 'fullfilled' and 'empty'");
  }
});

When("I'm logged out", config.stepTimeout, async function (this: ICustomWorld) {
  mainPage = new MainPage(this);
  loginPage = new LoginPage(this);

  await mainPage.performLogOut();
  await this.page?.waitForLoadState();

  result = await this.page?.locator(loginPage.loginBtn);

  await expect(result).toBeVisible();
});

Then("Clipboard contains {string} value", async function (this: ICustomWorld, text: string) {
  helper = new Helper(this);
  result = await helper.getClipboardValue();

  await expect(result).toBe(text);
});

Then("Clipboard is not empty", async function (this: ICustomWorld) {
  helper = new Helper(this);
  result = await helper.getClipboardValue();

  await expect(typeof result).toBe("string");
});

Given(
  "I fill the {string} input field by {string}",
  async function (this: ICustomWorld, inputField: string, text: string) {
    mainPage = new MainPage(this);
    await mainPage.fillText(inputField, text);
  }
);

Given(
  "I fill the {string} input field on the Contacts page with {string} text",
  async function (this: ICustomWorld, inputField: string, text: string) {
    contactsPage = new ContactsPage(this);
    await contactsPage.fillContactFields(inputField, text);
  }
);

Given("I click on the Copy button", async function (this: ICustomWorld) {
  await this.page?.locator("//button[@class='copy-button']").last().click();
});

Given("I click on the Save contact button", async function (this: ICustomWorld) {
  await this.page?.locator("//button[@type='submit' and text()='Save contact']").first().click();
});

Given("I click on the Edit contact button", async function (this: ICustomWorld) {
  contactsPage = new ContactsPage(this);
  await contactsPage.pressEditBtnModal();
});

Given("I am on the Main page", async function (this: ICustomWorld) {
  const basePage = new BasePage(this);
  element = await basePage.returnElementByType("text", "Assets");
  await expect(element).toBeVisible(config.defaultTimeout);
  await expect(this.page?.url()).toBe(config.BASE_URL + NetworkSwitcher.zkSyncEraGoerli);
});

Then("Current page have {string} address", config.stepTimeout, async function (this: ICustomWorld, route: string) {
  mainPage = new MainPage(this);
  helper = new Helper(this);
  await this.page?.waitForURL("**" + route);
  result = await this.page?.url();

  await expect(result).toContain(route);
});

Given("I click the Send button (modal) on the Contacts page", async function (this: ICustomWorld) {
  contactsPage = new ContactsPage(this);
  await contactsPage.pressSendBtnModal();
});

Given("I click on the First saved contact within the Contacts page", async function (this: ICustomWorld) {
  contactsPage = new ContactsPage(this);
  await contactsPage.clickOnSavedContact();
});

Given(
  "The {string} contact name is visible on the modal window within the Contacts page",
  async function (this: ICustomWorld, contactName: string) {
    contactsPage = new ContactsPage(this);
    element = await this.page?.locator(await contactsPage.contactNameModal(contactName));

    await expect(element).toBeVisible();
  }
);

Then("Fee should have {string} value", config.stepTimeout, async function (this: ICustomWorld, fee: string) {
  mainPage = new MainPage(this);
  basePage = new BasePage(this);
  element = mainPage.feeValue;
  result = await this.page?.locator(element);
  await expect(result).toContainText(fee);
});

Then(
  "Modal card element with the {string} xpath should be {string}",
  config.stepTimeout,
  async function (this: ICustomWorld, xpath: string, checkType: string) {
    mainPage = new MainPage(this);
    await mainPage.checkModalCardElement(xpath, checkType);
  }
);

Then("I close modal card", config.stepTimeout, async function (this: ICustomWorld) {
  const basePage = new BasePage(this);
  const mainPage = new MainPage(this);
  const modalCardElement = mainPage.modalCard;
  element = modalCardElement + mainPage.closeBtnModalCard;

  await basePage.click(element);
});

Then(
  "I hover the {string} element with {string} value",
  config.stepTimeout,
  async function (this: ICustomWorld, elementType: string, value: string) {
    const basePage = new BasePage(this);
    element = await basePage.returnElementByType(elementType, value);

    await element.hover();
  }
);
