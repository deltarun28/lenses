import { readdirSync, readFileSync } from "node:fs";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "@playwright/test";

/**
 * An update on the same origin. The test starts from a previous build (a copy of
 * this build whose service worker is marked as the previous version), deletes its
 * cache the way the old Study Quiz did, then serves this build. The new worker must
 * refill the cache, and saved observations must survive.
 *
 * Needs the static export (`out/`), so it runs with `npm run test:e2e:static`.
 */

const CURRENT = path.join(process.cwd(), "out");
const BASE = "/lenses";
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
};

function publishedLensIds(): string[] {
  const directory = path.join(process.cwd(), "src", "content", "lenses");
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readFileSync(path.join(directory, file), "utf8"))
    .filter((source) => /^status:\s*published\s*$/m.test(source))
    .map((source) => /^id:\s*(\S+)\s*$/m.exec(source)?.[1] ?? "")
    .filter(Boolean);
}

test.describe("Offline update", () => {
  test.skip(process.env.NEXT_STATIC_EXPORT !== "true", "needs the static export in out/");
  test.describe.configure({ mode: "serial" });

  let server: Server;
  let origin: string;
  let root: string;
  let previous: string;

  test.beforeAll(async () => {
    previous = await mkdtemp(path.join(tmpdir(), "lenses-previous-"));
    await cp(CURRENT, previous, { recursive: true });
    const sw = await readFile(path.join(CURRENT, "sw.js"), "utf8");
    await writeFile(path.join(previous, "sw.js"), `${sw}\n// previous build\n`);

    root = previous;
    server = createServer(async (req, res) => {
      const { pathname } = new URL(req.url ?? "/", "http://localhost");
      if (!pathname.startsWith(BASE)) return void res.writeHead(404).end();
      const rel = decodeURIComponent(pathname.slice(BASE.length));
      const target = path.normalize(path.join(root, rel));
      if (target !== root && !target.startsWith(`${root}${path.sep}`))
        return void res.writeHead(403).end();
      const candidates =
        rel === "" || rel.endsWith("/")
          ? [path.join(target, "index.html")]
          : [target, `${target}.html`, path.join(target, "index.html")];
      for (const candidate of candidates) {
        try {
          const body = await readFile(candidate);
          res.writeHead(200, {
            "content-type": MIME[path.extname(candidate)] ?? "application/octet-stream",
          });
          return void res.end(body);
        } catch {
          // Try the next candidate.
        }
      }
      res.writeHead(404).end();
    });
    await new Promise<void>((ready) => server.listen(0, "127.0.0.1", ready));
    origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  test.afterAll(async () => {
    server?.close();
    if (previous) await rm(previous, { recursive: true, force: true });
  });

  test("an update after the cache was deleted restores every page and keeps observations", async ({
    browser,
  }) => {
    const app = `${origin}${BASE}`;
    const context = await browser.newContext();
    const page = await context.newPage();

    // The previous build, installed and in use, with an observation saved on it.
    root = previous;
    await page.goto(`${app}/`);
    await page.waitForFunction(
      () => navigator.serviceWorker.controller !== null,
      undefined,
      { timeout: 30_000 },
    );
    await page.goto(`${app}/lenses/inversion`);
    await page
      .getByRole("textbox", { name: "Observation" })
      .fill("Written on the previous build.");
    await page.getByRole("button", { name: "Save observation" }).click();
    await expect(page.getByRole("status")).toHaveText(/saved on this device/i);

    // The old Study Quiz deleted every cache on the origin.
    await page.evaluate(async () => {
      for (const name of await caches.keys()) await caches.delete(name);
    });

    // Deploy this build. The page is still served by the previous worker until the new one takes over.
    root = CURRENT;
    await page.goto(`${app}/`);

    const precached = () =>
      page.evaluate(async () => {
        const paths: string[] = [];
        for (const name of (await caches.keys()).filter((n) =>
          n.startsWith("serwist-precache"),
        )) {
          for (const request of await (await caches.open(name)).keys())
            paths.push(new URL(request.url).pathname);
        }
        return paths;
      });
    const lensPaths = publishedLensIds().map((id) => `${BASE}/lenses/${id}`);
    await expect
      .poll(precached, { timeout: 60_000 })
      .toEqual(expect.arrayContaining(lensPaths));

    await context.setOffline(true);
    await page.goto(`${app}/lenses/margin-of-safety`);
    await expect(
      page.getByRole("heading", { name: /margin of safety/i, level: 1 }),
    ).toBeVisible();

    await page.goto(`${app}/observations`);
    await expect(page.getByText("Written on the previous build.")).toBeVisible();
    await context.close();
  });
});
