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

  test("shows every section of a lens in reading order", async ({ page }) => {
    await page.goto("lenses/inversion");

    const headings = await page
      .locator("article section[id]:not(#observation) > h2")
      .allInnerTexts();
    expect(headings.map((text) => text.toLowerCase())).toEqual([
      "principle",
      "explanation",
      "military example",
      "leadership example",
      "product example",
      "questions",
      "common misuse",
    ]);
  });

  test("leaves out a worked example the lens does not have", async ({ page }) => {
    // Product-market-fit carries no military example. If one is written for it,
    // point this at another lens that omits a section rather than deleting it.
    await page.goto("lenses/product-market-fit");

    const contents = page.getByRole("navigation", { name: "Sections" });
    await expect(contents.getByRole("link", { name: "Military" })).toHaveCount(0);
    // Six sections, plus the link to the reader's observation.
    await expect(contents.getByRole("link")).toHaveCount(7);
    await expect(
      page.getByRole("heading", { name: "Military Example", level: 2 }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Leadership Example", level: 2 }),
    ).toBeVisible();
  });
});
