import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * With NEXT_STATIC_EXPORT=true the same specs run against the GitHub Pages
 * artifact — the static export in `out/`, served under its base path — instead
 * of the Next server.
 *
 * The base path lives in `baseURL`, which is why the specs navigate with
 * relative paths (`page.goto("library")`, not `page.goto("/library")`). A
 * leading slash is absolute and would discard the base path, silently testing
 * the wrong URLs. `baseURL` therefore always ends in a slash, so the last
 * segment is kept when a relative path resolves against it.
 */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === "true";
const basePath = isStaticExport ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}${basePath}/`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: isStaticExport
      ? `npm run build:static && node scripts/serve-static.mjs --port ${PORT} --base ${basePath}`
      : `npm run build && npm run start -- --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}${basePath}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
