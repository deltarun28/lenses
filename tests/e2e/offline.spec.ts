import { expect, test } from "@playwright/test";

/**
 * Offline behaviour depends on the service worker, which only runs against a
 * production build. `npm run test:e2e` builds first, so this works locally; it
 * is skipped when the service worker has not taken control within a few seconds.
 */
test.describe("Offline", () => {
  test("a previously visited lens still opens without a connection", async ({
    page,
    context,
  }) => {
    await page.goto("/");
    const controlled = await page
      .waitForFunction(() => Boolean(navigator.serviceWorker.controller), null, {
        timeout: 10_000,
      })
      .then(() => true)
      .catch(() => false);

    test.skip(!controlled, "Service worker did not take control in time.");

    await page.goto("/lenses/inversion");
    await expect(
      page.getByRole("heading", { name: "Inversion", level: 1 }),
    ).toBeVisible();

    await context.setOffline(true);

    await page.goto("/lenses/inversion");
    await expect(
      page.getByRole("heading", { name: "Inversion", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Principle", level: 2 }),
    ).toBeVisible();

    await context.setOffline(false);
  });
});
