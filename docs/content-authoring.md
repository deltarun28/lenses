# Writing a lens

Adding a lens is a content change only. Create one Markdown file in
`src/content/lenses/` and it appears in the app — no code changes.

## File naming

`NN-lens-id.md`, where `NN` matches `sequence` and `lens-id` matches the `id`
in the frontmatter. For example `05-second-order-thinking.md`.

The number is for humans reading the directory. The app orders by `sequence`,
not by filename.

## Required frontmatter

```yaml
---
id: theory-of-constraints
title: Theory of Constraints
sequence: 15
categories:
  - Foundations
  - Systems Thinking
summary: Every system has one binding constraint, and improvement anywhere else is close to worthless.
keywords:
  - bottleneck
  - throughput
related:
  - systems-thinking
  - opportunity-cost
publishedAt: 2026-08-03
status: published
---
```

| Field         | Rules                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------- |
| `id`          | Lowercase kebab-case, unique, and the URL: `/lenses/<id>`. Do not change it after publishing. |
| `title`       | Display name.                                                                                 |
| `sequence`    | Positive integer, unique. Sets both library order and the daily order.                        |
| `categories`  | One or more, from the list below. Multiple categories are allowed.                            |
| `summary`     | One sentence, under 200 characters. Appears on the home page and cards.                       |
| `keywords`    | Search terms not already in the title or summary. Optional.                                   |
| `related`     | Ids of other lenses. Every id must exist or the build fails.                                  |
| `publishedAt` | `YYYY-MM-DD`. Quoted or unquoted both work.                                                   |
| `status`      | `published` or `draft`. Drafts are excluded everywhere, including routes.                     |

Valid categories: Foundations, Economics & Incentives, Probability & Risk,
Systems Thinking, Strategy, Leadership, Organisations, Military Thinking,
Psychology, Expertise & Learning, Negotiation, AI & Technology, Product Thinking.

They are defined in `LENS_CATEGORIES` in `src/domain/lenses/lens.ts`. Adding a
new category means editing that array.

## Sections

These seven `##` headings, spelled exactly like this, in this order:

```markdown
## Principle

## Explanation

## Military Example

## Leadership Example

## Product Example

## Questions

## Common Misuse
```

The strings come from `LENS_SECTION_HEADINGS` in `src/domain/lenses/lens.ts`.
Changing one there is a breaking change to every content file.

**Principle, Explanation, Questions and Common Misuse are required.**

**The three worked examples are optional, individually.** Not every lens applies
cleanly to every domain. If a lens has no honest military application, leave the
`## Military Example` heading out rather than inventing one — a forced example
is worse than an absent one, because it teaches a use the lens does not support.
Omitted examples disappear from the lens page and its contents row, rather than
leaving an empty section.

A heading left in place with nothing under it counts as omitted, so either form
works. What is rejected is a lens with **no** examples at all: the format's whole
claim is that a thinking tool earns its place by changing a decision somewhere
concrete.

- **Questions** must be a Markdown list (`- `). Each item becomes a numbered
  card entry. Three or four is right.
- **Related Models** is _not_ a section. It is generated from `related:` in the
  frontmatter.
- A missing section, or a Questions section that is not a list, fails the build
  with a message naming the file.

## Tone

The reference file is
[`src/content/lenses/18-goodharts-law.md`](../src/content/lenses/18-goodharts-law.md).
Match it.

- Concise and practical. Assume an intelligent reader in a hurry.
- Examples are specific and plausible, with a concrete mechanism. Not "a company
  improved its metrics" but what someone did and what followed.
- No motivational language, no exaggerated claims, no engagement copy, no
  stacked metaphors.
- "Common Misuse" must genuinely push back — where the lens misleads, who
  overuses it, when it does not apply. It is not a summary.
- Around 450–600 words of body text. Reading time is computed from word count.

## Internal links

Use standard Markdown links. Link to another lens by its route:

```markdown
See [Chesterton's Fence](/lenses/chestertons-fence) before removing it.
```

Obsidian `[[wikilinks]]` are tolerated by the word counter but are not rendered
as links yet — see `src/integrations/obsidian/README.md`. Prefer the `related:`
frontmatter field for relationships.

## Draft versus published

`status: draft` excludes a lens from the library, the daily sequence, search,
and static route generation. Drafts still have their frontmatter and sections
validated, so a broken draft fails the build. That is intentional.

## Before committing

```bash
npm test        # validates every content file
npm run build   # fails on any content error
```

`tests/unit/lens-content.test.ts` checks the whole shipped library: required
sections present, at least one worked example per lens, reading time computed,
and every `related:` id resolving.
