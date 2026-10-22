# Offline

Lenses works offline after one visit with a connection. The service worker is built by Serwist from `src/app/sw.ts` and configured in `next.config.ts`.

## What the install caches

- **Every published lens** (`/lenses/<id>`), the main pages (`/`, `/library`, `/observations`, `/about`), `/offline`, the manifest and the icons. The lens list comes from the same content the pages are generated from (`scripts/published-lens-ids.ts`, checked against the repository by a unit test), so a newly published lens is included in the next build.
- **Build assets** (scripts, styles), which Serwist precaches automatically.
- The first install downloads about 1.2 MB in 76 files.

## Runtime behaviour

- Moving between pages in the app uses Next's router payloads (RSC requests). Those are cached in `lenses-rsc`, bounded to 200 entries.
- Every other request goes to the network. A navigation the app cannot answer shows `/offline`.
- Observations and the start date stay in `localStorage` (`lenses.v1.` prefix). The worker never touches them.
- The automatic reload on reconnection is off (`reloadOnOnline: false`). An unsaved observation lives only in memory until Save is pressed, so a reload would discard it.

## Updates and cache names

- A new build installs as a standard service worker update: it precaches its own pages, and Serwist removes this app's outdated caches once the new worker activates. The new worker takes over on the next launch.
- Cache names are scoped to Lenses: the precache is `serwist-precache-…` with this app's scope, and the runtime cache is `lenses-…`. CacheStorage is shared by every app on the origin, and nothing here touches another app's caches.

## Limitations

- If the browser removes Lenses' cache (storage pressure, or another app's cleanup), it comes back with the next worker update, which means the next deploy. A page visit does not rebuild it. This is deliberate: the self-repair attempt was removed because it relied on an unsupported lifecycle workaround.
- Persistent storage is not requested, so Android may evict the cache under pressure.
- A draft is still lost if the browser process is killed before Save is pressed.
- Content added after an install is included only after the next deploy and update.

## Tests

`npm run test:e2e:static` runs:

- `tests/e2e/offline-cache.spec.ts`: a fresh install precaches every page; every published lens opens with the network off; unvisited lenses open offline; in-app navigation works offline; cache names are scoped; drafts survive reconnection; saved observations persist; other apps' caches are kept.
- `tests/e2e/offline.spec.ts`: a visited lens opens offline; an unknown address falls back to `/offline`.
- `tests/e2e/offline-update.spec.ts`: an update after the cache was deleted restores every page and keeps observations.

Phone checks: install with a connection, open the app once, turn on airplane mode, then open the library, an unvisited lens, and an observation. None of these has been tested on a phone yet.
