import { test, expect } from "@playwright/test";

test("ensure redirect to the login page at the start", async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await expect(page).toHaveURL("/login");
});

test("End to end test", async ({ page }) => {
  // Signup
  await page.goto("http://localhost:4200/signup");

  await page.fill('input[name="email"]', "user@example.com");
  await page.fill('input[name="pass"]', "A12345");
  await page.fill('input[name="cpass"]', "A12345");
  await page.click('button[name="signup"]');

  // Wait for redirect to login
  await page.waitForURL("http://localhost:4200/login", { timeout: 3000 });

  // Login
  await page.fill('input[name="email"]', "user@example.com");
  await page.fill('input[name="pass"]', "A12345");
  await page.click('button[name="login"]');

  // Redirect to homepage
  await expect(page).toHaveURL("http://localhost:4200/home");

  // Go to Products from home header
  await page.click('button[name="products"]');
  await page.waitForURL("http://localhost:4200/products");

  // Choose size and quantity for 1st product
  const firstProduct = page.locator(".product-card").nth(0);
  await firstProduct.locator("select").selectOption({ label: "40" });
  await firstProduct.locator('input[name="quantity"]').fill("1");
  await firstProduct.locator('button[name="add"]').click();

  // Choose size and quantity for 7st product
  const secondProduct = page.locator(".product-card").nth(6);
  await secondProduct.locator("select").selectOption({ label: "M" });
  await secondProduct.locator('input[name="quantity"]').fill("3");
  await secondProduct.locator('button[name="add"]').click();

  // Navigate to cart
  await page.click('button[name="cart"]');
  await page.waitForURL("http://localhost:4200/cart");

  // Verify cart has items
  await expect(page.locator(".cart-card")).toHaveCount(2);
});

/*

-----------------------------
Bonus - additional automation 
-----------------------------

i checked the errors in login and register

*/
test("invalid signup shows error", async ({ page }) => {
  await page.goto("http://localhost:4200/signup");
  await page.fill('input[name="email"]', "wrong@example,com");
  await page.fill('input[name="pass"]', "123456");
  await page.fill('input[name="cpass"]', "1234567");
  await expect(page.locator("text=Valid email is required.")).toBeVisible();
  await expect(
    page.locator(
      "text=Password must be at least 6 characters and contain 1 capital letter."
    )
  ).toBeVisible();
  await page.fill('input[name="email"]', "wrong@example,com"); //because the error does not show until i press on the screen or at any input field
  await expect(page.locator("text=Passwords do not match.")).toBeVisible();
  // its wrong to press the button because it will not work if there is an error in the first two fields
});

test("invalid login shows error", async ({ page }) => {
  //scenario 1
  await page.goto("http://localhost:4200/login");
  await page.fill('input[name="email"]', "wrong@example,com");
  await page.fill('input[name="pass"]', "123456");
  await expect(page.locator("text=Valid email is required.")).toBeVisible();
  await page.fill('input[name="email"]', "wrong@example.com");
  await page.click('button[name="login"]');
  await expect(page.locator("text=Email not found.")).toBeVisible();

  // scenario 2
  await page.goto("http://localhost:4200/signup");
  await page.fill('input[name="email"]', "wrong@example.com");
  await page.fill('input[name="pass"]', "A12345");
  await page.fill('input[name="cpass"]', "A12345");
  await page.click('button[name="signup"]');

  // Wait for redirect to login
  await page.waitForURL("http://localhost:4200/login", { timeout: 3000 });

  // Login
  await page.fill('input[name="email"]', "wrong@example.com");
  await page.fill('input[name="pass"]', "A123456");
  await page.click('button[name="login"]');
  await expect(page.locator("text=Wrong password.")).toBeVisible();
});

test("Invalid product size alert", async ({ page }) => {
  await page.goto("http://localhost:4200/signup");

  await page.fill('input[name="email"]', "user@example.com");
  await page.fill('input[name="pass"]', "A12345");
  await page.fill('input[name="cpass"]', "A12345");
  await page.click('button[name="signup"]');

  await page.waitForURL("http://localhost:4200/login", { timeout: 3000 });

  await page.fill('input[name="email"]', "user@example.com");
  await page.fill('input[name="pass"]', "A12345");
  await page.click('button[name="login"]');

  await expect(page).toHaveURL("http://localhost:4200/home");

  await page.click('button[name="products"]');
  await page.waitForURL("http://localhost:4200/products");

  const firstProduct = page.locator(".product-card").nth(0);
  await firstProduct.locator('input[name="quantity"]').fill("1");

  // Listen to the dialog before the click
  let alertShown = false;
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Please select a size");
    await dialog.accept();
    alertShown = true;
  });

  // Now click the add button (this will trigger the alert)
  await firstProduct.locator('button[name="add"]').click();

  // Small delay to ensure the dialog is caught
  await page.waitForTimeout(500);

  // Assert that alert was shown
  expect(alertShown).toBe(true);
});

test("Invalid quantity alert", async ({ page }) => {
  await page.goto("http://localhost:4200/signup");

  await page.fill('input[name="email"]', "user@example.com");
  await page.fill('input[name="pass"]', "A12345");
  await page.fill('input[name="cpass"]', "A12345");
  await page.click('button[name="signup"]');

  await page.waitForURL("http://localhost:4200/login", { timeout: 3000 });

  await page.fill('input[name="email"]', "user@example.com");
  await page.fill('input[name="pass"]', "A12345");
  await page.click('button[name="login"]');

  await expect(page).toHaveURL("http://localhost:4200/home");

  await page.click('button[name="products"]');
  await page.waitForURL("http://localhost:4200/products");

  const firstProduct = page.locator(".product-card").nth(0);
  await firstProduct.locator("select").selectOption({ label: "40" });
  await firstProduct.locator('input[name="quantity"]').fill("0");

  // Listen to the dialog before the click
  let alertShown = false;
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Quantity must be 1-20!");
    await dialog.accept();
    alertShown = true;
  });

  // Now click the add button (this will trigger the alert)
  await firstProduct.locator('button[name="add"]').click();

  // Small delay to ensure the dialog is caught
  await page.waitForTimeout(500);

  // Assert that alert was shown
  expect(alertShown).toBe(true);
});
