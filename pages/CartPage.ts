import { Page, Locator, expect } from "@playwright/test";
import constants from "../data/constants.json" with { type: "json" };

export class CartPage {
  readonly itemPrices: Locator;
  readonly itemName: Locator;
  readonly cartLink: Locator;
  readonly placeOrderBtn: Locator;
  readonly fullNameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly creditCardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly purchaseBtn: Locator;
  readonly totalPrice: Locator;
  readonly backhomeBtn: Locator;
  readonly thankYouOrderMessage: Locator;
  readonly receiptInformation: Locator;
  readonly receiptPopup: Locator;
  readonly confirmReceiptBtn: Locator;
  readonly closePlaceOrderBtn: Locator;

  constructor(readonly page: Page) {
    this.itemPrices = page.locator("#tbodyid tr td:nth-child(3)");
    this.itemName = page.locator("#tbodyid tr td:nth-child(2)");
    this.cartLink = page.locator("#cartur");
    this.placeOrderBtn = page.getByRole("button", { name: "Place Order" });
    this.fullNameInput = page.locator("#name");
    this.countryInput = page.locator("#country");
    this.cityInput = page.locator("#city");
    this.creditCardInput = page.locator("#card");
    this.monthInput = page.locator("#month");
    this.yearInput = page.locator("#year");
    this.purchaseBtn = page.getByRole("button", { name: "Purchase" });
    this.totalPrice = page.locator("#totalp");
    this.backhomeBtn = page.locator("#nava");
    this.thankYouOrderMessage = page.locator(".sweet-alert h2");
    this.receiptInformation = page.locator(".sweet-alert .lead");
    this.receiptPopup = page.locator(".sweet-alert");
    this.confirmReceiptBtn = page.getByRole("button", {
      name: "OK",
      exact: true,
    });
    this.closePlaceOrderBtn = page
      .locator(".modal-footer")
      .getByRole("button", {
        name: "Close",
        exact: true,
      });
  }

  async verifyCartURL() {
    await this.cartLink.click();
    expect(this.page).toHaveURL(constants.urls.cart);
  }

  async getAllCartNames() {
    return await this.itemName.allTextContents();
  }

  async verifyProductDisplayed() {
    await expect(this.itemName.first()).toBeVisible();
    const productNames = await this.getAllCartNames();
    expect(productNames).toContain(constants.text.samsungGalaxyText);
  }

  //Snapshot of the cart item count before adding a product
  async getCartItemCount(expectedCount?: number): Promise<number> {
    if (expectedCount !== undefined) {
      await expect(this.itemName).toHaveCount(expectedCount);
    }

    return await this.itemName.count();
  }

  //Count the number of items in the cart and verify it matches the expected count
  async verifyCartItemCount() {
    const itemCountBefore = await this.getCartItemCount();
    await expect(this.itemName).toHaveCount(itemCountBefore);
  }

  //   async removeProduct(productname: string) {
  //     const product = this.cartItem.filter({ hasText: productname });
  //     await product.getByRole("button", { name: "Remove" }).click();
  //   }

  //Start checkout process
  async clickOnPlaceOrder() {
    await this.placeOrderBtn.click();
  }

  //Fill out the checkout form with user information
  async fillCheckoutInformation(
    fullName: string,
    countryField: string,
    cityField: string,
    creditCard: string,
    monthField: string,
    yearField: string,
  ) {
    await this.fullNameInput.fill(fullName);
    await this.countryInput.fill(countryField);
    await this.cityInput.fill(cityField);
    await this.creditCardInput.fill(creditCard);
    await this.monthInput.fill(monthField);
    await this.yearInput.fill(yearField);
  }

  //Click on the "Purchase" button to complete the checkout process
  async clickOnPurchase() {
    await this.purchaseBtn.click();
  }

  async getSubTotalPrice() {
    await this.page.waitForLoadState("load");
    await expect(this.itemPrices.last()).toBeVisible();
    const subTotalText = await this.itemPrices.allTextContents();
    return subTotalText.reduce((total, price) => total + parseInt(price), 0);
  }

  async verfiyDisplayedTotalPrice() {
    const totalPrice = await this.getSubTotalPrice();
    const displayedTotalPrice = await this.getTotalPrice();
    expect(totalPrice).toBe(displayedTotalPrice);
  }

  async getTotalPrice() {
    const totalText = await this.totalPrice.textContent();
    return totalText ? parseInt(totalText) : 0;
  }

  //Back to home page
  async goBackHomePage() {
    await this.backhomeBtn.click();
  }

  //Thank you message after successful order
  async getThankYouOrderMessage() {
    return await this.thankYouOrderMessage.textContent();
  }

  async getOrderInformation(): Promise<string[]> {
    await expect(this.receiptPopup).toBeVisible();
    const orderInfo = await this.receiptInformation.allTextContents();
    return orderInfo
      .join("\n")
      .split(/\r?\n|(?=(?:Id|Amount|Card Number|Name|Date):\s*)/i)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  async verifyOrderInformation() {
    const orderInfo = await this.getOrderInformation();
    expect(orderInfo).toContain(orderInfo[0]); // Order ID
    expect(orderInfo).toContain(orderInfo[1]); // Amount
    expect(orderInfo).toContain(orderInfo[2]); // Card Number
    expect(orderInfo).toContain(orderInfo[3]); // Name
    expect(orderInfo).toContain(
      `Date: ${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`, //Date
    );
  }

  async verifyCartEmptyAfterOrderingSuccessfully() {
    await this.confirmReceiptBtn.click();
    await expect(this.receiptPopup).toBeHidden();
    await this.closePlaceOrderBtn.click();
    await this.goBackHomePage();
    await expect(this.page).toHaveURL(constants.urls.homeAfterLogin);
    await this.cartLink.click();
    const cartItemCount = await this.getCartItemCount();
    expect(cartItemCount).toBe(0);
  }
}
