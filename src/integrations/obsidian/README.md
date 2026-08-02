# Obsidian integration (future)

No code lives here yet, and none should be added without an explicit instruction.

## Why the MVP is already compatible

Lens content is plain Markdown with YAML frontmatter in `src/content/lenses/`.
That directory can be opened directly as an Obsidian vault today: frontmatter
renders as properties, and `## ` headings map to Obsidian's outline.

Constraints that keep this true — do not break them:

- No MDX, no JSX in content, no proprietary JSON content store.
- Frontmatter uses plain scalars and string arrays only.
- Relationships between lenses are expressed as ids in `related:`, not as
  imports or code references.
- Section structure is defined by headings, not by file layout.

## What a real integration would add

1. A `LensRepository` implementation that reads from a configured vault path
   instead of `src/content/lenses/`.
2. Resolution of `[[wikilinks]]` to lens ids (`src/lib/markdown.ts` already
   strips them when counting words, so only link rendering is missing).
3. A sync or import step, and a decision about which side owns edits.

Points 1 and 2 are additive. Point 3 is the one that needs a product decision
before any code is written.
