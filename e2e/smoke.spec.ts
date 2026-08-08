import { expect, test } from "@playwright/test";

/**
 * Smoke E2E suite — verifies core pages render and key entry points respond.
 * These tests intentionally avoid authenticated/admin flows and the contact
 * form submission (which writes to Supabase) so they are safe to run anywhere.
 */

const PAGES = [
  "/",
  "/about",
  "/achievements",
  "/services",
  "/gallery",
  "/blog",
  "/contact",
  "/sitemap",
  "/en/about",
  "/en/order",
];

for (const path of PAGES) {
  test(`renders ${path} without server errors`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response && response.status()).toBeLessThan(400);
    // The page must not render a Next.js error boundary message.
    await expect(page.locator("body")).not.toContainText("Application error");
  });
}

test("home page loads locale content and theme is interactive", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/RahatVerse/);
  // Theme toggle should exist somewhere in the layout.
  const themeToggle = page.locator('[data-testid="theme-toggle"], [aria-label*="theme" i]').first();
  if ((await themeToggle.count()) > 0) {
    await themeToggle.click();
  }
});

test("order wizard validates inline and updates the live quote", async ({ page }) => {
  await page.goto("/en/order?package=basic#order-checkout");
  await expect(page.getByText("Live estimated quote", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Please choose a website type")).toBeVisible();

  await page.getByRole("radio", { name: "Portfolio", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("checkbox", { name: /SEO Optimization/ }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("radio", { name: "5 pages", exact: true }).click();

  await expect(page.getByText(/7,000/).first()).toBeVisible();
});

test("package comparison can filter columns and differences", async ({ page }) => {
  await page.goto("/en/order");
  const premiumFilter = page.getByRole("button", { name: "Premium", exact: true });
  await expect(premiumFilter).toHaveAttribute("aria-pressed", "true");
  await premiumFilter.click();
  await expect(premiumFilter).toHaveAttribute("aria-pressed", "false");

  const differencesToggle = page.getByRole("button", { name: "Differences only", exact: true });
  await differencesToggle.click();
  await expect(differencesToggle).toHaveAttribute("aria-pressed", "true");
});
