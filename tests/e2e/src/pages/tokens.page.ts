/* eslint-disable @typescript-eslint/no-explicit-any */

import { BasePage } from "./base.page";

import type { ICustomWorld } from "../support/custom-world";

let element: any;
let result: any;

export class TokensPage extends BasePage {
  constructor(world: ICustomWorld) {
    super(world);
  }

  get activeToggle() {
    return "[@role='switch' and contains(@class,'active')]";
  }

  get disabledToggle() {
    return "[@role='switch' and @class='switch-container']";
  }

  async getTokenSwitcher(tokenName: string) {
    element = `//*[@class='token-item']//*[@alt="${tokenName}"]/../../..//button`;
    return element;
  }

  async getTokenSwitcherState(tokenName: string, state: string) {
    element = await this.getTokenSwitcher(tokenName);

    if (state === "on") {
      result = element + this.activeToggle;
    } else if (state === "off") {
      result = element + this.disabledToggle;
    } else {
      console.error("Incorrect state has been provided");
    }

    return result;
  }
}
