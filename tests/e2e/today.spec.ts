import { expect, test } from "@playwright/test";

test.describe("Today", () => {
  test("shows a day number and opens today's lens", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Today", level: 1 })).toBeVisible();
    await expect(page.getByText(/^Day \d{3}$/)).toBeVisible();

    await page.getByRole("link", { name: /Read today's lens/i }).click();

    await expect(page).toHaveURL(/\/lenses\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Principle", level: 2 }),
    ).toBeVisible();
  });

  test("moves to another day and keeps it after a reload", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Day number").fill("5");
    await page.getByRole("button", { name: "Go to day" }).click();

    await expect(page.getByText("Day 005")).toBeVisible();
    await expect(page.getByRole("status")).toHaveText("Moved to day 5.");

    await page.reload();
    await expect(page.getByText("Day 005")).toBeVisible();
  });

  test("steps through the sections of a lens", async ({ page }) => {
    await page.goto("/lenses/inversion");

    await expect(page.getByText("01 / 07")).toBeVisible();
    await page.getByRole("button", { name: "Next section" }).click();
    await expect(page.getByText("02 / 07")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Explanation", level: 2 }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Common misuse" }).click();
    await expect(page.getByText("07 / 07")).toBeVisible();
    await expect(page.getByRole("button", { name: "Next section" })).toBeDisabled();
  });
});
