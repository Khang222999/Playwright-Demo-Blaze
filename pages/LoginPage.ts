import { Page, Locator, expect } from "@playwright/test";
import constants from "../data/constants.json" with { type: "json" };

export class LoginPage {
  readonly baseURL: string;

  //Defining locators for the login page
  readonly navLogin: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly welcomeText: Locator;
  readonly modalLogin: Locator;
  readonly logoutButton: Locator;

  constructor(readonly page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || "";

    this.navLogin = page.getByRole("link", { name: "Log in" });
    this.username = page.locator("#loginusername");
    this.password = page.locator("#loginpassword");
    this.loginButton = page.getByRole("button", {
      name: "Log in",
      exact: true,
    });
    this.welcomeText = page.locator("#nameofuser");
    this.modalLogin = page.locator("#logInModal");
    this.logoutButton = page.locator("#logout2");
  }

  async open() {
    await this.page.goto(this.baseURL);
  }

  async clickOnLogin() {
    await this.navLogin.click();
  }

  async verifyLogin(username: string, password: string) {
    await expect(this.modalLogin).toBeVisible();
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState("domcontentloaded"); // Wait for the DOM loads fully
    await expect(this.modalLogin).toBeHidden(); // Assert modal login close
    await expect(this.welcomeText).toHaveText(`Welcome ${username}`); // Assert Welcome username displays correctly after logging in successfully
    await expect(this.logoutButton).toBeVisible(); // Assert logout display
  }

  async verifyLoginAlert() {
    await expect(this.modalLogin).toBeVisible();

    const dialogPromise = this.page
      .waitForEvent("dialog")
      .then(async (dialog) => {
        const result = {
          type: dialog.type(),
          message: dialog.message(),
        };

        await dialog.accept(); // Dismiss before making assertions
        return result;
      });

    await this.loginButton.click();
    const dialog = await dialogPromise;

    expect(dialog.type).toBe("alert");
    expect(dialog.message).toBe(constants.dialogMessage.validatEmptyCredential);
  }
}
