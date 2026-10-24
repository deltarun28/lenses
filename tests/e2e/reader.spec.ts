import { devices, expect, test } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test.describe("Reading a lens on a phone", () => {
  test("the principle is on the first screen", async ({ page }) => {
    await page.goto("lenses/inversion");
    await expect(page.locator("#principle .lens-prose")).toBeInViewport();
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("the whole lens reads by scrolling, with no taps", async ({ page }) => {
    await page.goto("lenses/inversion");
    await page
      .getByRole("heading", { name: "Common Misuse", level: 2 })
      .scrollIntoViewIfNeeded();
    await expect(page.locator("#common-misuse .lens-prose")).toBeVisible();
    await expect(page.locator("#explanation .lens-prose")).toBeAttached();
  });

  test("a contents link brings its section heading on screen", async ({ page }) => {
    await page.goto("lenses/inversion");
    const contents = page.getByRole("navigation", { name: "Sections" });
    await contents.getByRole("link", { name: "Questions" }).tap();

    await expect(page).toHaveURL(/#questions$/);
    const heading = page.getByRole("heading", { name: "Questions", level: 2 });
    await expect(heading).toBeInViewport();
    const top = await heading.evaluate((element) => element.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(0);
    expect(top).toBeLessThan(120);
  });

  test("a section can be opened directly by its address", async ({ page }) => {
    await page.goto("lenses/inversion#common-misuse");
    await expect(
      page.getByRole("heading", { name: "Common Misuse", level: 2 }),
    ).toBeInViewport();
  });

  test("the contents row is one row", async ({ page }) => {
    await page.goto("lenses/inversion");
    const rows = await page
      .getByRole("navigation", { name: "Sections" })
      .getByRole("link")
      .evaluateAll(
        (links) => new Set(links.map((a) => a.getBoundingClientRect().top)).size,
      );
    expect(rows).toBe(1);
  });

  test("controls on a lens page are at least 44px tall", async ({ page }) => {
    await page.goto("lenses/inversion");
    const small = await page.evaluate(() =>
      [...document.querySelectorAll("main button, main textarea, nav a")]
        .map((element) => ({
          name: (element.textContent ?? "").trim().slice(0, 30),
          height: element.getBoundingClientRect().height,
        }))
        .filter((entry) => entry.height > 0 && entry.height < 44),
    );
    expect(small).toEqual([]);

    // Related lenses: the whole row is the target, not just the title text.
    const row = page.locator('section[aria-labelledby="related-heading"] li').first();
    await row.scrollIntoViewIfNeeded();
    const rowBox = await row.boundingBox();
    expect(rowBox!.height).toBeGreaterThanOrEqual(44);
    await page.mouse.click(rowBox!.x + rowBox!.width - 8, rowBox!.y + rowBox!.height - 8);
    await expect(page).toHaveURL(/\/lenses\/second-order-thinking$/);
  });
});
