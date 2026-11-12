import { test } from "../fixtures/my-fixture";
import users from "../data/users.json" with { type: "json" };

test(
  "add product to cart",
  { tag: "@auth" },
  async ({ homePage, loginPage }) => {
    // Login temporarily to the application before adding product to cart
    await loginPage.clickOnLogin();
    await loginPage.verifyLogin(
      users.validUser.username,
      users.validUser.password,
    );
    await test.step("click on the product and go to details", async () => {
      await homePage.verifySamsungGalaxyS6ProductDetails();
    });
    await test.step("verify product is added to cart", async () => {
      await homePage.verifyProductAddedSuccessfully();
    });
  },
);
