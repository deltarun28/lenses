import { expect, test } from "@playwright/test";

test.describe("Library", () => {
  test("searches by keyword and opens a result", async ({ page }) => {
    await page.goto("/library");

    const results = page.getByRole("listitem");
    const initialCount = await results.count();
    expect(initialCount).toBeGreaterThan(5);

    await page.getByLabel("Search").fill("bottleneck");

    await expect(
      page.getByRole("heading", { name: "Theory of Constraints" }),
    ).toBeVisible();
    expect(await results.count()).toBeLessThan(initialCount);

    await page.getByRole("link", { name: /Theory of Constraints/ }).click();
    await expect(page).toHaveURL(/\/lenses\/theory-of-constraints/);
  });

  test("filters by category and reports an empty result honestly", async ({ page }) => {
    await page.goto("/library");

    await page.getByRole("button", { name: "Military Thinking" }).click();
    await expect(page.getByRole("heading", { name: "OODA Loop" })).toBeVisible();

    await page.getByLabel("Search").fill("zzzzz");
    await expect(page.getByText(/No lenses match that search/)).toBeVisible();
  });
});
