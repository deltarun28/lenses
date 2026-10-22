import path from "node:path";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";
import { publishedLensIds } from "./scripts/published-lens-ids";

/**
 * Serwist generates `public/sw.js` from `src/app/sw.ts` at build time.
 * Disabled in development so the service worker never caches work-in-progress output.
 */
const basePathForPrecache = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Everything a reader can open is precached at install, so Lenses works offline
 * after one online visit: the main pages, the icons and every published lens. The
 * lens list comes from the same content the pages are generated from, so a new
 * published lens is included on the next build without a code change. The
 * revision changes per build, so a deploy replaces the cached copies.
 *
 * Paths are relative to the site root. The base path is added here, because
 * service worker precache entries do not get it from Next.
 */
const PRECACHE_REVISION = `${Date.now()}`;
const PRECACHE_PATHS = [
  "/",
  "/library",
  "/observations",
  "/about",
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  ...publishedLensIds(path.join(process.cwd(), "src", "content", "lenses")).map(
    (id) => `/lenses/${id}`,
  ),
];

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  /**
   * Off. Serwist's default reloads the page whenever the browser comes back online.
   * An observation that has not been saved lives only in memory until Save is
   * pressed, so that reload would discard it. In flight mode the connection can
   * change at any moment, so this would happen to real text.
   */
  reloadOnOnline: false,
  additionalPrecacheEntries: PRECACHE_PATHS.map((url) => ({
    url: `${basePathForPrecache}${url}`,
    revision: PRECACHE_REVISION,
  })),
});

/**
 * Static export, for GitHub Pages. Off by default so `npm run dev`,
 * `npm run build`, `npm start` and the Playwright suite keep working against a
 * normal Next server, and so a Vercel deployment is unaffected.
 *
 * Every route in this app prerenders — there are no route handlers, server
 * actions or dynamic functions — so exporting is a packaging choice, not a
 * reduction in behaviour. Anything added later that needs a server will break
 * `npm run build:static` first, which is the intended warning.
 */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === "true";

/**
 * Subdirectory the site is served from. A GitHub Pages project site lives under
 * `/<repo>`; the domain root needs no prefix. Read from the same environment
 * variable as `src/lib/base-path.ts` so the two can never disagree.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  ...(basePath ? { basePath } : {}),
  ...(isStaticExport
    ? {
        output: "export",
        // GitHub Pages has no image optimiser; the app ships static assets only.
        images: { unoptimized: true },
      }
    : {}),
};

export default withSerwist(nextConfig);
