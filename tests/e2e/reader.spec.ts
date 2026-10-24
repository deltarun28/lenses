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
  test("the observation follows the lens, before related lenses", async ({ page }) => {
    await page.goto("lenses/inversion");
    const order = await page
      .locator("article")
      .evaluate((article) =>
        [...article.querySelectorAll("section[aria-labelledby]")].map((section) =>
          section.getAttribute("aria-labelledby"),
        ),
      );
    expect(order.slice(-3)).toEqual([
      "common-misuse-heading",
      "observation-heading",
      "related-heading",
    ]);
  });

  test("the contents row reaches the observation in one tap", async ({ page }) => {
    await page.goto("lenses/inversion");
    const contents = page.getByRole("navigation", { name: "Sections" });
    const link = contents.getByRole("link", { name: "Your observation" });
    await link.scrollIntoViewIfNeeded();
    await link.tap();

    await expect(page).toHaveURL(/#observation$/);
    await expect(
      page.getByRole("heading", { name: "Your observation", level: 2 }),
    ).toBeInViewport();
    await expect(page.getByRole("textbox", { name: "Observation" })).toBeInViewport();
  });

  test("a scrolling chip row fades only the edge with more to show", async ({ page }) => {
    await page.goto("library");
    const row = page.getByRole("group", { name: "Filter by category" });
    const fades = () =>
      row.evaluate((element) => {
        const style = getComputedStyle(element);
        return [
          style.getPropertyValue("--row-fade-start").trim(),
          style.getPropertyValue("--row-fade-end").trim(),
        ];
      });

    const [startAtStart, endAtStart] = await fades();
    expect(startAtStart).toBe("0px");
    expect(endAtStart).not.toBe("0px");

    await row.evaluate((element) => (element.scrollLeft = element.scrollWidth));
    await expect.poll(fades).toEqual([expect.not.stringMatching(/^0px$/), "0px"]);
  });
});
