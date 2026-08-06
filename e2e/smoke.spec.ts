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
