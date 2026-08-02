import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

/**
 * Serwist generates `public/sw.js` from `src/app/sw.ts` at build time.
 * Disabled in development so the service worker never caches work-in-progress output.
 */
const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
};

export default withSerwist(nextConfig);
