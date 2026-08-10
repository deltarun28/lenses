import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { withBasePath } from "@/lib/base-path";

/**
 * Service worker.
 *
 * Precaches the app shell at build time and caches lens pages as they are
 * visited, so a lens you have already opened stays readable offline. Anything
 * never visited falls back to /offline.
 *
 * No push notifications. Do not add them.
 */

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        // A precache key, not a route, so the base path is applied by hand.
        url: withBasePath("/offline"),
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();
