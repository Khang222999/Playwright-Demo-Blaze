import { test } from "../../fixtures/my-fixture";
import users from "../../data/users.json" with { type: "json" };
import constants from "../../data/constants.json" with { type: "json" };

test(
  "login and add product to card then place order successfully",
  { tag: "@e2e" },
  async ({ loginPage, homePage, cartPage }) => {
    await test.step("verify login to a valid credential successfully", async () => {
      await loginPage.clickOnLogin();
      await loginPage.verifyLogin(
        users.validUser.username,
        users.validUser.password,
      );
    });
    await test.step("click on Samsung Galaxy S6 product and go to details", async () => {
      await homePage.verifySamsungGalaxyS6ProductDetails();
    });
    await test.step("verify product is added to cart", async () => {
      await homePage.verifyProductAddedSuccessfully();
    });
    await test.step("go back to home page", async () => {
      await cartPage.goBackHomePage();
    });
    await test.step("click on Nokia Lumia product and go to details", async () => {
      await homePage.verifyNokiaLumiaProductDetails();
    });
    await test.step("verify Nokia Lumia product is added to cart", async () => {
      await homePage.verifyProductAddedSuccessfully();
    });
    await test.step("go to cart", async () => {
      await cartPage.verifyCartURL();
    });
    await test.step("verify product is displayed the title and price correctly", async () => {
      await cartPage.verifyProductDisplayed();
      await cartPage.verifyCartItemCount();
      await cartPage.verfiyDisplayedTotalPrice();
    });
    await test.step("click on Place Order button", async () => {
      await cartPage.clickOnPlaceOrder();
    });
    await test.step("Fill out all user's information to checkout", async () => {
      await cartPage.fillCheckoutInformation(
        constants.checkoutData.fullName,
        constants.checkoutData.country,
        constants.checkoutData.city,
        constants.checkoutData.creditCard,
        constants.checkoutData.month,
        constants.checkoutData.year,
      );
    });
    await test.step("click on Purchase button", async () => {
      await cartPage.clickOnPurchase();
    });
    await test.step("verify thank you message and order information ", async () => {
      await cartPage.verifyOrderInformation();
    });
    await test.step("verify cart empty after ordering successfully", async () => {
      await cartPage.verifyCartEmptyAfterOrderingSuccessfully();
    });
  },
);
