import { test, expect } from "@playwright/test";

test("ensure unauthenticated users are redirected to the login page", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL("/login");
});
