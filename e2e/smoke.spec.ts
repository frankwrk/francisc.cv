import { expect, test } from "@playwright/test";

test("home loads and nav Work opens /work", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/francisc|Furdui/i);

  await page.getByRole("link", { name: "Work" }).first().click();
  await expect(page).toHaveURL(/\/work/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
