import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { ExpirationPlugin, NetworkFirst, NetworkOnly, Serwist } from "serwist";
import { withBasePath } from "@/lib/base-path";

/**
 * Service worker.
 *
 * Precaches the whole app at install: the main pages, the icons and every
 * published lens (see `next.config.ts`). Once installed, the app works offline
 * without another visit. Anything not precached goes to the network, and a
 * navigation that cannot be answered falls back to /offline.
 *
 * Updates use the standard install: a new build installs its own precache, and
 * Serwist removes this app's outdated caches once it activates.
 *
 * Cache names. CacheStorage is shared by every app on this origin, so nothing
 * here touches a cache that is not Lenses'. The precache is named by Serwist with
 * this app's scope in it. The runtime cache is named `lenses-…`.
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
  precacheOptions: { cleanupOutdatedCaches: true },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Moving between pages inside the app fetches each page's router payload,
      // which is an RSC request. Keep those responses, so pages already seen stay
      // reachable without a connection. The cache is bounded, so it cannot grow
      // without limit.
      matcher: ({ request }) => request.headers.get("RSC") === "1",
      handler: new NetworkFirst({
        cacheName: "lenses-rsc",
        plugins: [new ExpirationPlugin({ maxEntries: 200 })],
      }),
    },
    {
      // Everything else goes to the network. This is what Serwist's defaults end
      // with, and it matters: a request that no rule matches is never handed to the
      // fallback below, so an offline navigation would fail instead of showing the
      // offline page.
      matcher: /.*/i,
      handler: new NetworkOnly(),
    },
  ],
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
