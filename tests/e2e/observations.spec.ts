import { expect, test } from "@playwright/test";

const NOTE = "Used this in the Monday delivery review.";

test.describe("Observations", () => {
  test("saves an observation and shows it on the observations page", async ({ page }) => {
    await page.goto("lenses/inversion");

    await page.getByRole("textbox", { name: "Observation" }).fill(NOTE);
    await page.getByRole("button", { name: "Save observation" }).click();

    await expect(page.getByRole("status")).toHaveText(/saved on this device/i);

    await page.goto("observations");
    await expect(page.getByRole("link", { name: "Inversion" })).toBeVisible();
    await expect(page.getByText(NOTE)).toBeVisible();
  });

  test("keeps one observation per lens when saved again", async ({ page }) => {
    await page.goto("lenses/inversion");
    await page.getByRole("textbox", { name: "Observation" }).fill("First version.");
    await page.getByRole("button", { name: "Save observation" }).click();

    await page.getByRole("textbox", { name: "Observation" }).fill("Second version.");
    await page.getByRole("button", { name: "Save observation" }).click();

    await page.goto("observations");
    await expect(page.getByText("Second version.")).toBeVisible();
    await expect(page.getByText("First version.")).toHaveCount(0);
  });

  test("deletes an observation from the observations page", async ({ page }) => {
    await page.goto("lenses/ooda-loop");
    await page.getByRole("textbox", { name: "Observation" }).fill(NOTE);
    await page.getByRole("button", { name: "Save observation" }).click();

    await page.goto("observations");
    await page
      .getByRole("button", { name: /Delete your observation on OODA Loop/ })
      .click();

    await expect(page.getByText(NOTE)).toHaveCount(0);
    await expect(page.getByText(/Nothing saved yet/)).toBeVisible();
  });

  test("deletes an observation from the lens page", async ({ page }) => {
    await page.goto("lenses/lindy-effect");
    await page.getByRole("textbox", { name: "Observation" }).fill(NOTE);
    await page.getByRole("button", { name: "Save observation" }).click();

    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByRole("status")).toHaveText("Observation deleted.");
    await expect(page.getByRole("textbox", { name: "Observation" })).toHaveValue("");
  });
});
