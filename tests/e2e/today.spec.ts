import { expect, test } from "@playwright/test";

test.describe("Today", () => {
  test("shows a day number and opens today's lens", async ({ page }) => {
    await page.goto("./");

    await expect(page.getByRole("heading", { name: "Today", level: 1 })).toBeVisible();
    await expect(page.getByText(/^Day \d{3}$/)).toBeVisible();

    // The link renders a typographic apostrophe (&rsquo;), so match either form
    // rather than assuming the ASCII one.
    await page.getByRole("link", { name: /Read today[’']s lens/i }).click();

    await expect(page).toHaveURL(/\/lenses\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Principle", level: 2 }),
    ).toBeVisible();
  });

  test("moves to another day and keeps it after a reload", async ({ page }) => {
    await page.goto("./");

    await page.getByLabel("Day number").fill("5");
    await page.getByRole("button", { name: "Go to day" }).click();

    await expect(page.getByText("Day 005")).toBeVisible();
    await expect(page.getByRole("status")).toHaveText("Moved to day 5.");

    await page.reload();
    await expect(page.getByText("Day 005")).toBeVisible();
  });

  test("steps through the sections of a lens", async ({ page }) => {
    await page.goto("lenses/inversion");

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

  test("skips a worked example the lens does not have", async ({ page }) => {
    // Product-market-fit carries no military example. If one is written for it,
    // point this at another lens that omits a section rather than deleting it.
    await page.goto("lenses/product-market-fit");

    const jump = page.getByRole("group", { name: "Jump to section" });
    await expect(jump.getByRole("button", { name: "Military" })).toHaveCount(0);
    await expect(jump.getByRole("button", { name: "Leadership" })).toBeVisible();

    // Six sections, not seven, and no blank card in the middle.
    await expect(page.getByText("01 / 06")).toBeVisible();
    await page.getByRole("button", { name: "Next section" }).click();
    await page.getByRole("button", { name: "Next section" }).click();
    await expect(
      page.getByRole("heading", { name: "Leadership Example", level: 2 }),
    ).toBeVisible();
  });
});
