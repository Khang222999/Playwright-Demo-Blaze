import { Page, Locator, expect } from "@playwright/test";
import constants from "../data/constants.json" with { type: "json" };

export class HomePage {
  readonly productSamsungS6: Locator;
  readonly productNokiaLumia: Locator;
  //   private readonly itemPrices: Locator;
  readonly addProductToCartBtn: Locator;

  constructor(readonly page: Page) {
    this.productSamsungS6 = page.getByRole("link", {
      name: "Samsung galaxy s6",
    });
    this.productNokiaLumia = page.getByRole("link", {
      name: "Nokia lumia 1520",
    });
    // this.itemPrices = page.locator("h3.price-container");
    this.addProductToCartBtn = page.getByRole("link", { name: "Add to cart" });
  }

  //Navigate to the product details page for Samsung Galaxy S6
  async verifySamsungGalaxyS6ProductDetails() {
    await this.productSamsungS6.click();
    expect(this.page).toHaveURL(constants.urls.productSamsungGalaxyS6);
  }

  //Navigate to the product details page for Nokia Lumia 1520
  async verifyNokiaLumiaProductDetails() {
    await this.productNokiaLumia.click();
    expect(this.page).toHaveURL(constants.urls.productNokiaLumia);
  }

  async verifyProductAddedSuccessfully() {
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

    await this.addProductToCartBtn.click();
    const dialog = await dialogPromise;

    expect(dialog.type).toBe("alert");
    expect(dialog.message).toBe(
      constants.dialogMessage.productAddedSuccessfully,
    );
  }
}
