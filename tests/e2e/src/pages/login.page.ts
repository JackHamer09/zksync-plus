import { BasePage } from "./base.page";
import { MetamaskPage } from "./metamask.page";
import { MetamaskWallet } from "../data/data";
import { config } from "../support/config";

import type { ICustomWorld } from "../support/custom-world";

export class LoginPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  get loginBtn() {
    return ".login-btn-inner";
  }

  get notificationBtn() {
    return "//button[2]";
  }

  get cancelBtn() {
    return "//button[1]";
  }

  get headlineSignIn() {
    return ".sign-in-headline";
  }

  async connectMetamask() {
    const loginStatus = await this.checkLoginStatus();

    if (!loginStatus) {
      const metamaskPage = await new MetamaskPage(this.world);
      await this.world.page?.locator("data-testid=login-button").click(); //click a login button

      // await this.world.page?.locator('w3m-wallet-image').first().click()
      const popUp = await new MetamaskPage(this.world).catchPopUpByClick("w3m-wallet-image");
      await popUp?.locator(metamaskPage.unlockPasswordField).isVisible(config.defaultTimeout);
      await popUp?.setViewportSize(config.popUpWindowSize);
      const passwordFieldVisible = await popUp
        ?.locator(metamaskPage.unlockPasswordField)
        .isVisible(config.defaultTimeout);
      if (passwordFieldVisible) {
        await popUp?.locator(metamaskPage.unlockPasswordField).fill(MetamaskWallet.mainWalletPassword);
        await popUp?.locator(metamaskPage.confirmUnlockBtn).click();
      }
      await popUp?.waitForTimeout(700);

      if (popUp !== undefined) {
        try {
          await popUp?.locator(this.notificationBtn).click();
          await popUp?.locator(this.notificationBtn).click();

          if ((await popUp?.locator(this.notificationBtn)) !== undefined) {
            await popUp?.locator(this.notificationBtn).click(); //change network
          }
        } catch {
          return false;
        }
      }
    }
    // const isAuthorized = await this.world.page?.locator("//h1[contains(text(), 'Home')]").isVisible();
    // await expect(isAuthorized).toBe(true);
  }

  // async connectMetamask() {
  //   const basePage = await new BasePage(this.world);
  //   const loginPage = await new LoginPage(this.world);
  //   const metamaskPage = await new MetamaskPage(this.world);
  //   const loginStatus = await this.checkLoginStatus();
  //   const loginBtnElementHidden = await this.world.page
  //     ?.locator( this.loginBtn)
  //     .isHidden(config.increasedTimeout);
  //   const authorizedElementVisible = await this.world.page?.locator(this.byTestId).isVisible(config.increasedTimeout);
  //   await this.world.page?.reload();
  //   if (loginStatus === "false" || (!loginBtnElementHidden && !authorizedElementVisible)) {
  //     await basePage.click(loginPage.loginBtn, true);
  //     await this.world.page?.waitForLoadState("load", config.increasedTimeout);
  //     if (loginStatus === "false" || (loginBtnElementHidden && !authorizedElementVisible)) {
  //       const popUp = await new MetamaskPage(this.world).catchPopUpByClick(this.loginBtn);
  //       const passwordFieldVisible = await popUp
  //         ?.locator(metamaskPage.unlockPasswordField)
  //         .isVisible(config.defaultTimeout);
  //       await popUp?.setViewportSize(config.popUpWindowSize);
  //       if (passwordFieldVisible) {
  //         await popUp?.locator(metamaskPage.unlockPasswordField).fill(MetamaskWallet.mainWalletPassword);
  //         await popUp?.locator(metamaskPage.confirmUnlockBtn).click();
  //       }
  //       await popUp?.waitForTimeout(700);
  //       if (popUp !== undefined) {
  //         try {
  //           await popUp?.locator(this.notificationBtn).click();
  //           await popUp?.locator(this.notificationBtn).click();
  //         } catch {
  //           return false;
  //         }
  //       }
  //     }
  //   }
  // }

  async connectMetamaskWithCancel() {
    const metamaskPage = await new MetamaskPage(this.world);
    const popUp = await new MetamaskPage(this.world).catchPopUpByClick(this.loginBtn);
    await popUp?.setViewportSize(config.popUpWindowSize);
    await popUp?.waitForLoadState();
    try {
      await popUp
        ?.locator(metamaskPage.unlockPasswordField)
        .fill(MetamaskWallet.mainWalletPassword, config.defaultTimeout);
      await popUp?.locator(metamaskPage.confirmUnlockBtn).click(config.defaultTimeout);
      await popUp?.locator(this.cancelBtn).first().click(config.defaultTimeout);
    } catch {
      await popUp?.locator(this.cancelBtn).first().click();
    }
  }

  async logout() {
    await this.world.page?.evaluate(() => window.localStorage.clear());
    await this.world.page?.waitForTimeout(500);
    await this.world.page?.reload();
    await this.world.page?.waitForURL(config.BASE_URL);
  }

  async checkLoginStatus() {
    return await this.world.page?.evaluate(() => window.localStorage["useWallet_isAuthenticated"]);
  }
}
