import type { LensCategory, LensSummary } from "@/domain/lenses/lens";

/**
 * Client-side search over the published lens index.
 *
 * Pure and synchronous: the whole index is small enough that filtering on every
 * keystroke costs nothing, and keeping it pure makes it directly testable.
 */

export interface LensSearchCriteria {
  query?: string;
  categories?: LensCategory[];
}

function haystackFor(lens: LensSummary): string {
  return [lens.title, lens.summary, ...lens.categories, ...lens.keywords]
    .join(" ")
    .toLowerCase();
}

export function tokenize(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

export function matchesQuery(lens: LensSummary, query: string): boolean {
  const tokens = tokenize(query);
  if (tokens.length === 0) return true;
  const haystack = haystackFor(lens);
  return tokens.every((token) => haystack.includes(token));
}

export function matchesCategories(
  lens: LensSummary,
  categories: LensCategory[],
): boolean {
  if (categories.length === 0) return true;
  return categories.some((category) => lens.categories.includes(category));
}

export function searchLenses(
  lenses: LensSummary[],
  criteria: LensSearchCriteria = {},
): LensSummary[] {
  const query = criteria.query ?? "";
  const categories = criteria.categories ?? [];
  return lenses.filter(
    (lens) => matchesQuery(lens, query) && matchesCategories(lens, categories),
  );
}

/** Categories actually present in the index, in the app's canonical order. */
export function availableCategories(
  lenses: LensSummary[],
  ordered: readonly LensCategory[],
): LensCategory[] {
  const present = new Set(lenses.flatMap((lens) => lens.categories));
  return ordered.filter((category) => present.has(category));
}
