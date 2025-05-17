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
