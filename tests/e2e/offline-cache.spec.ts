import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

/**
 * Offline behaviour of an installed Lenses app. These run against a production
 * build (the service worker only exists there), so they use the same
 * `test:e2e:static` setup as the rest of the suite.
 */

/** Lens ids with `status: published`, read the way the app reads them. */
function publishedLensIds(): string[] {
  const directory = path.join(process.cwd(), "src", "content", "lenses");
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readFileSync(path.join(directory, file), "utf8"))
    .filter((source) => /^status:\s*published\s*$/m.test(source))
    .map((source) => /^id:\s*(\S+)\s*$/m.exec(source)?.[1] ?? "")
    .filter(Boolean);
}

/** Every URL path the install should have precached: the main pages and every lens. */
function expectedPrecachePaths(baseURL: string | undefined): string[] {
  const main = ["", "library", "observations", "about", "offline"];
  const lenses = publishedLensIds().map((id) => `lenses/${id}`);
  return [...main, ...lenses].map((relative) => new URL(relative, baseURL).pathname);
}

async function waitForWorker(page: Page) {
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, undefined, {
    timeout: 30_000,
  });
}

/** Paths of every entry in this app's precache, however the cache is named. */
async function precachedPaths(page: Page): Promise<string[]> {
  return page.evaluate(async () => {
    const paths: string[] = [];
    for (const name of (await caches.keys()).filter((n) => n.startsWith("serwist-precache"))) {
      for (const request of await (await caches.open(name)).keys()) {
        paths.push(new URL(request.url).pathname);
      }
    }
    return paths;
  });
}

async function cacheNames(page: Page): Promise<string[]> {
  return page.evaluate(async () => (await caches.keys()).sort());
}

test.describe("Offline cache", () => {
  test("the install precaches the main pages and every published lens", async ({ page, baseURL }) => {
    await page.goto("./");
    await waitForWorker(page);

    const expected = expectedPrecachePaths(baseURL);
    await expect
      .poll(() => precachedPaths(page), { timeout: 20_000 })
      .toEqual(expect.arrayContaining(expected));
  });

  test("a lens never opened on this device opens with the network off", async ({ page, context }) => {
    await page.goto("./");
    await waitForWorker(page);
    await expect
      .poll(() => precachedPaths(page), { timeout: 20_000 })
      .toEqual(expect.arrayContaining([new URL("lenses/margin-of-safety", page.url()).pathname]));

    await context.setOffline(true);
    await page.goto("lenses/margin-of-safety");
    await expect(page.getByRole("heading", { name: /margin of safety/i, level: 1 })).toBeVisible();
  });

  test("after one online visit, every published lens opens with the network off", async ({ page, context, baseURL }) => {
    test.setTimeout(240_000);
    await page.goto("./");
    await waitForWorker(page);
    await expect
      .poll(() => precachedPaths(page), { timeout: 20_000 })
      .toEqual(expect.arrayContaining(expectedPrecachePaths(baseURL)));

    await context.setOffline(true);
    for (const id of publishedLensIds()) {
      await page.goto(`lenses/${id}`);
      await expect(page.locator("h1").first(), `lens ${id}`).toBeVisible();
      await expect(page.getByRole("heading", { name: /not available offline/i }), `lens ${id}`).toHaveCount(0);
    }
  });

  test("moving inside the app to a lens never opened works with the network off", async ({ page, context }) => {
    await page.goto("./");
    await waitForWorker(page);
    await expect
      .poll(() => precachedPaths(page), { timeout: 20_000 })
      .toEqual(expect.arrayContaining([new URL("lenses/margin-of-safety", page.url()).pathname]));

    await page.goto("library");
    await context.setOffline(true);
    await page.getByRole("link", { name: /margin of safety/i }).first().click();
    await expect(page.getByRole("heading", { name: /margin of safety/i, level: 1 })).toBeVisible();
  });

  test("every cache this app creates is named for Lenses", async ({ page }) => {
    await page.goto("./");
    await waitForWorker(page);
    await page.goto("library");
    await page.getByRole("link", { name: /inversion/i }).first().click();
    await expect(page.getByRole("heading", { name: /inversion/i, level: 1 })).toBeVisible();

    for (const name of await cacheNames(page)) {
      expect(name.startsWith("serwist-precache") || name.startsWith("lenses-"), `cache "${name}" is not named for Lenses`).toBe(true);
    }
  });

  test("an unsaved observation survives the connection coming back", async ({ page, context }) => {
    await page.goto("./");
    await waitForWorker(page);
    await page.goto("lenses/inversion");

    const draft = "Half-written note, typed with no connection.";
    await context.setOffline(true);
    await page.getByRole("textbox", { name: "Observation" }).fill(draft);

    // The browser fires `online` when the connection returns. The app must not reload.
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event("online")));
    await page.waitForTimeout(1500);

    await expect(page.getByRole("textbox", { name: "Observation" })).toHaveValue(draft);
  });

  test("saved observations are still there after a restart with the network off", async ({ page, context }) => {
    await page.goto("./");
    await waitForWorker(page);
    await page.goto("lenses/inversion");
    await page.getByRole("textbox", { name: "Observation" }).fill("Kept across a restart.");
    await page.getByRole("button", { name: "Save observation" }).click();
    await expect(page.getByRole("status")).toHaveText(/saved on this device/i);

    await context.setOffline(true);
    const restarted = await context.newPage();
    await restarted.goto("observations");
    await expect(restarted.getByText("Kept across a restart.")).toBeVisible();
  });

  test("installing Lenses keeps other apps' caches", async ({ page }) => {
    // Another app's caches on the same origin, made before this app's worker exists.
    await page.goto("manifest.webmanifest");
    await page.evaluate(async () => {
      await (await caches.open("minesweeper-v3")).put("/kept", new Response("x"));
      await (await caches.open("electrical-quiz-v8")).put("/kept", new Response("x"));
    });

    await page.goto("./");
    await waitForWorker(page);
    await expect
      .poll(() => cacheNames(page), { timeout: 20_000 })
      .toEqual(expect.arrayContaining(["electrical-quiz-v8", "minesweeper-v3"]));
  });
});
