import { test } from "../fixtures/my-fixture";
import users from "../data/users.json" with { type: "json" };

test(
  "login to valid credentials successfully",
  { tag: "@auth" },
  async ({ loginPage }) => {
    await test.step("open login modal", async () => {
      await loginPage.clickOnLogin();
    });

    await test.step("verify login successfully with valid user", async () => {
      await loginPage.verifyLogin(
        users.validUser.username,
        users.validUser.password,
      );
    });
  },
);

test(
  "login to invalid credentials by username and password emtpy",
  { tag: "@negative-path" },
  async ({ loginPage }) => {
    await test.step("open login modal", async () => {
      await loginPage.clickOnLogin();
    });

    await test.step("verify errror message requires to enter username and password", async () => {
      await loginPage.verifyLoginAlert();
    });
  },
);
