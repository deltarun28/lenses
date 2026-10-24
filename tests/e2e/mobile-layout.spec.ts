import { devices, expect, test } from "@playwright/test";

// A mid-size Android phone. The narrowest common width is covered separately.
test.use({ ...devices["Pixel 7"] });

const PAGES = [
  "./",
  "library",
  "lenses/inversion",
  "lenses/correlated-errors",
  "observations",
  "about",
];

test.describe("Mobile layout", () => {
  test("no page scrolls sideways at phone widths", async ({ page }) => {
    for (const width of [360, 412]) {
      await page.setViewportSize({ width, height: 800 });
      for (const path of PAGES) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    }
  });

  test("the library shows lenses on the first screen", async ({ page }) => {
    await page.goto("library");
    const firstCard = page.getByRole("link", { name: /Inversion/ }).first();
    const box = await firstCard.boundingBox();
    const viewport = page.viewportSize();
    expect(box && viewport && box.y + box.height).toBeLessThan(viewport!.height * 0.6);
  });

  test("category filters sit on one row and stay one tap away", async ({ page }) => {
    await page.goto("library");
    const group = page.getByRole("group", { name: "Filter by category" });
    const all = group.getByRole("button", { name: "All" });
    await expect(all).toHaveAttribute("aria-pressed", "true");

    const tops = await group
      .getByRole("button")
      .evaluateAll(
        (buttons) => new Set(buttons.map((b) => b.getBoundingClientRect().top)).size,
      );
    expect(tops).toBe(1);

    const chip = group.getByRole("button", { name: "Product Thinking" });
    await chip.scrollIntoViewIfNeeded();
    await chip.tap();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    await expect(all).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByText(/^\d+ of 73 lenses$/)).toBeVisible();

    await all.tap();
    await expect(page.getByText(/^73 lenses$/)).toBeVisible();
  });

  test("an empty search offers a way back", async ({ page }) => {
    await page.goto("library");
    await page.getByLabel("Search").fill("zzzzz");
    await page.getByRole("button", { name: "Clear search and filters" }).tap();
    await expect(page.getByLabel("Search")).toHaveValue("");
    await expect(page.getByText(/^73 lenses$/)).toBeVisible();
  });
});
