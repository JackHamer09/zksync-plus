/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasePage } from "./base.page";
import { Extension, MetamaskWallet } from "../data/data";
import { Helper } from "../helpers/helper";
import { config } from "../support/config";

import elementsId from "../../utils/elementsId.json";
import metamaskId from "../../utils/metamaskId.json";

import type { ICustomWorld } from "../support/custom-world";

let page: any;
let element: any;
let networkIsChecked: any;
let metamaskAdvSettingsUrl: string;
let metamaskHomeUrl: string;
let metamaskWelcomeUrl: string;
let metamaskNetworkSettingsUrl: string;
let testId: any;
let logoutTrigger: any = undefined;

export class MetamaskPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  get aggressiveFee() {
    return "//input[@value='high']";
  }

  get feeTypes() {
    return "//*[@class='transaction-detail-edit']//button";
  }

  get feeChangerBtn() {
    return "//div[@class='edit-gas-display']//button";
  }

  get saveFeeBtn() {
    return "//*[@class='popover-container']//button";
  }

  get metamaskResetButton() {
    return "//*[@data-testid='advanced-setting-reset-account']//button[1]"; // //button[contains(text(),'Reset')]|
  }

  get metamaskConfirmResetButton() {
    return "//button[@role='button'][2]"; // //button[text()='Reset']|
  }

  get startWorkBtn() {
    return ".button.btn--rounded.btn-primary.first-time-flow__button";
  }

  get extensionDetailsBtn() {
    return "id=detailsButton";
  }

  get feeCurrency() {
    return "//*[contains(text(),'$')]";
  }

  get acceptMetricsBtn() {
    return elementsId.metamask.approveButton;
  }

  get confirmTransaction() {
    return "//*[@data-testid='page-container-footer-next']";
  }

  get declineBtn() {
    return "//*[@data-testid='page-container-footer-cancel']";
  }

  get secretPhraseField() {
    return "//*[@type='password'][1]";
  }

  get newPasswordField() {
    return "//*[@autocomplete='new-password' and @id='password']";
  }

  get confirmPasswordField() {
    return "id=confirm-password";
  }

  get unlockPasswordField() {
    return "#password";
  }

  get confirmUnlockBtn() {
    return "//button[1]";
  }

  get checkboxTermsUsage() {
    return "//*[@href='https://metamask.io/terms.html']/../../../../input";
  }

  get importBtn() {
    return "//button[@type='submit']";
  }

  get succeedBtn() {
    return "//button[@role='button']";
  }

  get arrowDown() {
    return "data-testid=signature-request-scroll-button";
  }

  get confirmBtn() {
    return "//div[@class='confirmation-footer']//button[2]";
  }

  get mainBtn() {
    return ".button";
  }

  get metamaskFormField() {
    return "@class='form-field__input'";
  }

  async metamaskValue(value: string) {
    return `@value='${value}'`;
  }

  async networkAttribute(attribute: string) {
    return `//*[${this.metamaskFormField} and ${await this.metamaskValue(attribute)}]`;
  }

  //metamask home page
  get headerIcon() {
    return "(//*[contains(@class,'app-header')]//div[contains(@class,'identicon')])[1]";
  }

  get logoutBtn() {
    return "//div[@class='account-menu']//button";
  }

  get popOverMenuCloseBtn() {
    return "//h2[@title='popover']/..//button";
  }

  async getCodePhraseField(indx: number) {
    element = `id=import-srp__srp-word-` + indx.toString();
    return await element;
  }

  async getloginPage() {
    testId = new BasePage(this.world).byTestId;
    await page.bringToFront();
    await page.reload();
    await page.click(this.mainBtn);
    await page.click(this.mainBtn);
    await page.click(testId + this.acceptMetricsBtn);
  }

  async importMetamaskAccount(secretPhrase: Array<string>, password: string) {
    await this.fillSecretPhrase(secretPhrase);
    await page.fill(this.newPasswordField, password);
    await page.fill(this.confirmPasswordField, password);
    await page.locator(this.checkboxTermsUsage).click({ force: true });
    await page.bringToFront();
    await page.click(this.importBtn);
    await page.click(this.succeedBtn);
  }

  private async fillSecretPhrase(walletPhrase: Array<string>) {
    for (let i = 0; i < walletPhrase.length; i++) {
      const secretWord: string = walletPhrase[i].toString();
      const codePhraseField: object = await this.getCodePhraseField(i);
      await page.locator(codePhraseField).fill(secretWord);
    }
  }

  async authorizeInMetamaskExtension(secretPhrase: Array<string>, password: string) {
    page = this.world.page;

    if (metamaskWelcomeUrl === undefined) {
      await this.getMetamaskExtensionUrl();
      await page.goto(metamaskWelcomeUrl);
      await page.reload();
      await page.bringToFront();
      await this.getloginPage();
      await this.importMetamaskAccount(secretPhrase, password);
    } else {
      await page.goto(metamaskWelcomeUrl);
      if (logoutTrigger && (await page.$(this.unlockPasswordField)) !== null) {
        await page.locator(this.unlockPasswordField).fill(MetamaskWallet.mainWalletPassword);
        await page.locator(this.confirmUnlockBtn).click();
      }
    }
    logoutTrigger = false;
  }

  async operateTransaction(triggeredElement: string, actionType: string) {
    // await this.w
    // const incorrectNetworkMsg = " Incorrect network selected in your MetaMask wallet ";
    // if ((await this.world.page?.$(incorrectNetworkMsg)) !== null) {
    await this.clickBy("xpath", "//div[@class='transaction-footer-row']//button");
    // };

    const popUpContext = await this.catchPopUpByClick(triggeredElement);
    await popUpContext?.setViewportSize(config.popUpWindowSize);

    if (networkIsChecked == undefined) {
      //change network
      try {
        await popUpContext?.click(this.confirmBtn);
        const transactionConfirmationElement: any = await popUpContext
          ?.locator(this.confirmTransaction)
          .isVisible(config.increasedTimeout);
        const networkConfirmationElement: any = await popUpContext
          ?.locator(this.confirmBtn)
          .isVisible(config.increasedTimeout);
        if (!transactionConfirmationElement && networkConfirmationElement) {
          await popUpContext?.click(this.confirmBtn);
        }
      } finally {
        const transactionContext = await this.catchPopUp();
        //confirm transaction
        await this.processTransaction(transactionContext, actionType);
      }
    } else {
      await this.processTransaction(popUpContext, actionType);
    }
    networkIsChecked = true;
    return networkIsChecked;
  }

  async catchPopUpByClick(element: string) {
    testId = new BasePage(this.world).byTestId;
    const helper = await new Helper(this.world);
    const [popUp] = await Promise.all([
      this.world.context?.waitForEvent("page"),
      await helper.checkElementVisible(element),
      await this.world.page?.locator(element).first().click(),
    ]);
    return popUp;
  }

  async catchPopUp() {
    const [popUp] = await Promise.all([this.world.context?.waitForEvent("page")]);
    return popUp;
  }

  private async getMetamaskExtensionUrl() {
    await page.goto(Extension.allExtensionsUrl);
    await page.locator(this.extensionDetailsBtn).click();
    let extractedId: any = await page.url();
    extractedId = await extractedId.match("\\=(.*)")[1];
    metamaskHomeUrl = Extension.specifiedExtensionUrl + extractedId + Extension.metamaskHomeHtml;
    metamaskWelcomeUrl = metamaskHomeUrl + Extension.metamaskInitialize;
    metamaskAdvSettingsUrl = metamaskHomeUrl + Extension.metamaskAdvSettings;
    metamaskNetworkSettingsUrl = metamaskHomeUrl + Extension.metamaskNetworkSettings;
  }

  private async processTransaction(context: any, actionType: string) {
    await context?.setViewportSize(config.popUpWindowSize);
    await context?.bringToFront();
    if (actionType === "confirm") {
      await this.selectAggressiveFee(context);
      await context?.click(this.confirmTransaction, config.increasedTimeout);
    } else if (actionType === "reject") {
      await context?.click(this.declineBtn, config.increasedTimeout);
    } else {
      console.error("Incorrect actionType value: it should be only confirm or reject");
    }
  }

  async resetNonce() {
    page = this.world.page;
    await page.goto(metamaskAdvSettingsUrl);
    await this.click(this.metamaskResetButton);
    await this.click(this.metamaskConfirmResetButton);
    await page.waitForTimeout(1.5 * 1000);
  }

  async checkNetworkAttribute(attribute: string) {
    page = this.world.page;
    await page.goto(metamaskNetworkSettingsUrl);
    if (attribute === "zkSync Era Testnet") {
      element = await this.networkAttribute(metamaskId.zksyncGoerliNetwork.networkName);
    } else if (attribute === "https://testnet.era.zksync.dev") {
      element = await this.networkAttribute(metamaskId.zksyncGoerliNetwork.newRpcUrl);
    } else if (attribute === "280") {
      element = await this.networkAttribute(metamaskId.zksyncGoerliNetwork.chainId);
    } else if (attribute === "ETH") {
      element = await this.networkAttribute(metamaskId.zksyncGoerliNetwork.currencySymbol);
    } else if (attribute === "https://goerli.explorer.zksync.io") {
      element = await this.networkAttribute(metamaskId.zksyncGoerliNetwork.blockExplorerUrl);
    }
    await page.waitForTimeout(1.5 * 1000);
    return element;
  }

  async selectAggressiveFee(context: any) {
    await context?.click(this.feeTypes, config.increasedTimeout);
    await context?.click(this.feeChangerBtn, config.increasedTimeout);
    const aggressiveFeeVisibility = await context?.locator(this.aggressiveFee).isVisible(config.defaultTimeout);
    if (aggressiveFeeVisibility) {
      await context?.click(this.aggressiveFee, config.increasedTimeout);
    }
    await context?.click(this.saveFeeBtn, config.increasedTimeout);
  }

  async logout() {
    const page = await this.world.context?.newPage();
    await page?.goto(metamaskWelcomeUrl);
    await page?.waitForLoadState("domcontentloaded");

    if (logoutTrigger === false || logoutTrigger === undefined || (await page?.$(this.unlockPasswordField)) === null) {
      if (await page?.locator(this.popOverMenuCloseBtn).isVisible(config.defaultTimeout)) {
        await page?.locator(this.popOverMenuCloseBtn).first().click(config.defaultTimeout);
      }
      if (await page?.locator(this.headerIcon).first().isVisible(config.defaultTimeout)) {
        await page?.locator(this.headerIcon).first().click();
        await page?.locator(this.logoutBtn).first().click();
      }
    }
    return (logoutTrigger = true);
  }

  async isLogout() {
    return logoutTrigger;
  }
}
