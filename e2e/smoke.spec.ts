import { test, expect } from "@playwright/test";

test("home renders brand and rails shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /mflix/i })).toBeVisible();
  await expect(page.getByPlaceholder(/search movies/i)).toBeVisible();
});

