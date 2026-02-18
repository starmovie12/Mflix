import { expect, test } from "@playwright/test";

test("homepage loads with MFLIX branding", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/MFLIX/i);
  await expect(page.getByText("MFLIX").first()).toBeVisible();
});
