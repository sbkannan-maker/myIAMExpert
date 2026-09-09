import { expect, test } from "@playwright/test";

const savedPatternIds = [1, 2, 3];

test.beforeEach(async ({ page }) => {
  await page.addInitScript((ids) => {
    window.localStorage.setItem("iiq-field-guide-saved-use-cases", JSON.stringify(ids));
  }, savedPatternIds);
});

test("restores public catalog filters from a shared URL", async ({ page }) => {
  await page.goto("/use-cases?q=contractor&category=JML&complexity=Advanced");
  await expect(page).toHaveURL(/q=contractor/);
  await expect(page).toHaveURL(/category=JML/);
  await expect(page).toHaveURL(/complexity=Advanced/);
  await expect(page.getByText("Contractor", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("JML", { exact: true }).first()).toBeVisible();
});

test("opens a side-by-side comparison for saved patterns", async ({ page }) => {
  await page.goto("/use-cases");
  await page.getByRole("button", { name: /compare saved/i }).click();
  await expect(page.getByRole("heading", { name: "Compare shortlisted use cases" })).toBeVisible();
  await expect(page.getByText("Pattern comparison", { exact: true })).toBeVisible();
  await expect(page.getByText("Implementation signals", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /return to catalog/i })).toBeVisible();
});
