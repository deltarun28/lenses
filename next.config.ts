import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

/**
 * Serwist generates `public/sw.js` from `src/app/sw.ts` at build time.
 * Disabled in development so the service worker never caches work-in-progress output.
 */
const basePathForPrecache = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
  /**
   * Serwist precaches build assets — scripts, stylesheets, icons — but no HTML,
   * because pages are cached at runtime as they are visited. The offline
   * fallback is the exception: it is only ever needed for a page the user has
   * *not* visited, so if it is not precached it is not there when it is wanted,
   * and an offline navigation fails with a network error instead.
   *
   * The revision changes per build so a deploy replaces the cached copy.
   */
  additionalPrecacheEntries: [
    { url: `${basePathForPrecache}/offline`, revision: `${Date.now()}` },
  ],
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
