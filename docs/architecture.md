# Architecture

## Principles

- Explicit over clever. Small files, named exports, no dependency injection
  framework, no global state library.
- Content, storage and presentation never touch each other directly. Each
  crosses a named boundary.
- Anything with real logic — dates, day selection, search, parsing — is a pure
  function tested in isolation.

## Domain boundaries

```
src/
  domain/         types and validation only, no I/O
  repositories/   the boundaries: content in, storage out
  services/       pure logic over domain types
  components/     presentation
  app/            routes and composition
  integrations/   future-facing interfaces, no implementations
  lib/            small shared utilities
```

The rule that keeps this honest: `domain/` imports nothing from
`repositories/`, `services/` or `components/`. Dependencies point inwards.

## Content loading flow

1. `src/content/lenses/*.md` — plain Markdown, YAML frontmatter.
2. `filesystem-lens-repository.ts` reads the directory once per process.
3. `gray-matter` splits frontmatter from body.
4. `lensFrontmatterSchema` (Zod) validates frontmatter. Failure throws with the
   filename, which fails the build.
5. `splitSectionsByHeading` maps `## Heading` blocks to a `Map`.
6. Required sections are checked against `LENS_SECTION_HEADINGS`. A missing
   section throws, naming the section and the file.
7. Prose sections are rendered to HTML with `marked`. The Questions section is
   extracted as a list of strings.
8. Word count and reading time are computed at this point — at build time for
   static pages, never in the browser.
9. The whole collection is validated: unique ids, unique sequences, and every
   `related:` id resolving to a real lens.

`LensRepository` is the only interface the app knows about. Swapping to an
Obsidian vault, CMS or API means writing one more implementation and changing
the single `lensRepository` export.

`Lens` includes the body; `LensSummary` does not. Client components receive
summaries, so lens bodies are not serialised into the page payload for pages
that only list them.

## Daily lens selection

All in `src/services/daily-lens/day-cycle.ts`, all pure.

```
dayNumberFor(startDate, today)  -> day number, minimum 1
startDateForDay(day, today)     -> the inverse; used by "go to day"
lensIndexForDay(day, total)     -> (day - 1) mod total
itemForDay(items, day)          -> the lens, or null for an empty library
cycleNumberForDay(day, total)   -> which pass through the library
```

One stored value (`startDate`) means current day and start date cannot diverge.
Jumping to a day rewrites the start date rather than adding a second piece of
state.

Dates are local `YYYY-MM-DD` strings throughout (`src/lib/dates.ts`).
Differences are computed by converting the parsed calendar components through
`Date.UTC`, which makes the arithmetic immune to daylight saving and timezone
offsets. There is no timestamp division anywhere.

Resolution happens in the browser (`TodayPanel`), because the answer depends on
the device clock. Everything else on the page is static.

## Observation storage

```
domain/observations/observation.ts        pure: parse, upsert, remove, sort
repositories/observations/…-repository.ts the interface
repositories/observations/local-…         localStorage implementation
repositories/observations/…-store.ts      React binding (useSyncExternalStore)
lib/storage.ts                            the only file that touches localStorage
```

Keys are namespaced and versioned (`lenses.v1.observations`). A future schema
change bumps the namespace rather than migrating in place.

Identity is `lensId`: one observation per lens, saving updates in place. Parsing
is defensive — a corrupt entry is dropped, the rest survive.

The store layer exists so components can read storage through
`useSyncExternalStore` instead of copying values into state inside an effect.
Writes invalidate a cached snapshot and notify subscribers, and a `storage`
event listener keeps other tabs in sync.

## Search

`src/services/search/search-lenses.ts`. Pure, synchronous, client-side over the
full published index, which is small. Query tokens are ANDed; each token must
appear in the combined title, summary, categories and keywords. Selected
categories are ORed, then ANDed with the query.

If the library grows past a few hundred lenses, this is the file to replace —
the interface would not need to change.

## PWA caching

Serwist builds `public/sw.js` from `src/app/sw.ts` during `next build`.

- Precache: the build manifest — app shell, static chunks, statically generated
  pages.
- Runtime: Serwist's `defaultCache`, which covers pages, data and static assets
  as they are requested.
- Fallback: document requests that miss the cache while offline render
  `/offline`.
- Disabled in development so a stale worker never serves work in progress.

## Future Obsidian integration

Content is already vault-compatible: plain Markdown, plain frontmatter, headings
for structure, ids for relationships. `src/integrations/obsidian/README.md`
records what must stay true and what a real integration would add. Nothing in
the app assumes the filesystem beyond `filesystem-lens-repository.ts`.

## Future AI integration

`src/integrations/ai/model-application-service.ts` defines a
`ModelApplicationService` interface for a later "apply this lens to my
situation" feature. There is no implementation, no provider, no mock and no UI —
deliberately. Building it means writing an adapter and adding a surface; nothing
else needs to change.
