# Instructions for AI coding agents

Read this before changing anything in this repository.

## What this is

A progressive web app that delivers one practical thinking lens per day. It is
deliberately small. The value is in the writing and in staying out of the
reader's way.

## MVP boundaries — do not add without an explicit instruction

- Streaks, points, badges, levels, progress gamification of any kind
- Push notifications
- Accounts, sign-in, subscriptions, payments
- Social features, sharing feeds, comments
- AI chat, or any implementation behind `ModelApplicationService`
- Analytics, tracking, session recording
- Knowledge graphs or visualisations
- Locking future days, or any gate on the library

The daily sequence is a suggested reading path. Every published lens is
available from the start. If a change would make part of the library
unreachable, it is wrong.

## Architectural rules

1. **Dependencies point inwards.** `domain/` imports nothing from
   `repositories/`, `services/` or `components/`.
2. **One boundary per concern.** Content is read only through `LensRepository`.
   Storage is touched only through a repository. `lib/storage.ts` is the only
   file that references `localStorage`.
3. **Server components by default.** Add `"use client"` only where browser
   state, storage or event handlers require it. Today, the stepper, the library
   browser and the observation components are client; everything else is not.
4. **Pure logic stays pure.** Dates, day selection, search and content parsing
   are pure functions with unit tests. Do not put branching logic in components.
5. **No `any`.** If it is unavoidable, document why on the line above.
6. **Dates are local `YYYY-MM-DD` strings.** Never timestamps, never
   `Date.now()` arithmetic for day boundaries. Use `src/lib/dates.ts`.
7. **No new state libraries, event buses or DI frameworks.** `useState` and
   `useSyncExternalStore` are sufficient at this size.
8. **Do not copy stored values into state inside an effect.** Use the store
   modules (`observation-store.ts`, `reading-state-store.ts`) with
   `useSyncExternalStore`. The lint rule `react-hooks/set-state-in-effect`
   enforces this.

## Where things live

| Concern                      | File                                                     |
| ---------------------------- | -------------------------------------------------------- |
| Lens types, section headings | `src/domain/lenses/lens.ts`                              |
| Frontmatter validation       | `src/domain/lenses/schema.ts`                            |
| Content loading              | `src/repositories/content/filesystem-lens-repository.ts` |
| Content source interface     | `src/repositories/content/lens-repository.ts`            |
| Daily selection              | `src/services/daily-lens/day-cycle.ts`                   |
| Search                       | `src/services/search/search-lenses.ts`                   |
| Observations (logic)         | `src/domain/observations/observation.ts`                 |
| Observations (storage)       | `src/repositories/observations/`                         |
| Start date                   | `src/repositories/reading-state/`                        |
| Service worker               | `src/app/sw.ts`                                          |
| Manifest                     | `src/app/manifest.ts`                                    |
| Design tokens                | `src/styles/globals.css`                                 |
| Lesson content               | `src/content/lenses/*.md`                                |

## Commands

```bash
npm run dev          # development server
npm run build        # production build (webpack; Serwist needs it)
npm run lint         # ESLint — must be clean
npm run typecheck    # tsc --noEmit — must be clean
npm test             # Vitest unit tests
npm run test:e2e     # Playwright; builds and serves automatically
npm run format       # Prettier
```

Before finishing any task: `npm run lint && npm run typecheck && npm test && npm run build`.

## Testing expectations

Unit tests are required for any change to date handling, day selection, search
or content parsing. These are pure functions with no excuse for being untested.

Do not write unit tests that assert on markup. UI behaviour belongs in the
Playwright specs in `tests/e2e/`.

`tests/unit/lens-content.test.ts` validates the real content library. If you add
a lens, that test covers it automatically.

## Content changes

Adding or editing a lens is a content-only change. See
`docs/content-authoring.md`. The seven section headings are defined in
`LENS_SECTION_HEADINGS`; changing one there requires updating every file in
`src/content/lenses/` in the same commit.

Do not write filler content. Do not generate lenses in bulk without the examples
being specific and mechanically plausible. The "Common Misuse" section must
genuinely argue against the lens.

## Preserving the extension points

Two interfaces exist for future work and must keep working:

- **Obsidian.** Content stays plain Markdown with plain YAML frontmatter.
  No MDX, no JSX in content, no proprietary content store, no build step that
  makes the files unreadable in a vault. Constraints are recorded in
  `src/integrations/obsidian/README.md`.
- **AI.** `src/integrations/ai/model-application-service.ts` is an interface
  only. Do not implement it, do not add a provider client, do not add a mock
  response, and do not surface it in the UI.

## Accessibility floor

Do not regress: semantic headings in order, every control reachable and operable
by keyboard, visible focus states, labels on all inputs, live regions for save
and delete confirmations, and `prefers-reduced-motion` respected. New UI matches
this standard before it is considered done.
