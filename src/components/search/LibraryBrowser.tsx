"use client";

import { useMemo, useState } from "react";
import { LensCard } from "@/components/lenses/LensCard";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  LENS_CATEGORIES,
  type LensCategory,
  type LensSummary,
} from "@/domain/lenses/lens";
import { cn } from "@/lib/cn";
import { availableCategories, searchLenses } from "@/services/search/search-lenses";

const CHIP =
  "plate inline-flex min-h-11 shrink-0 items-center rounded-sm px-3 whitespace-nowrap transition-colors";
const CHIP_ON = "bg-accent text-accent-ink";
const CHIP_OFF = "border-rule text-muted hover:text-ink border";

/**
 * Client-side search and category filtering over the published index.
 *
 * On a phone the controls take two rows — the search field and one row of
 * categories that scrolls sideways — so the first lenses are on the first
 * screen. From the `md` breakpoint the categories wrap instead.
 */
export function LibraryBrowser({ lenses }: { lenses: LensSummary[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LensCategory[]>([]);

  const categories = useMemo(
    () => availableCategories(lenses, LENS_CATEGORIES),
    [lenses],
  );

  const results = useMemo(
    () => searchLenses(lenses, { query, categories: selected }),
    [lenses, query, selected],
  );

  const toggleCategory = (category: LensCategory) => {
    setSelected((current) =>
      current.includes(category)
        ? current.filter((entry) => entry !== category)
        : [...current, category],
    );
  };

  const clearAll = () => {
    setQuery("");
    setSelected([]);
  };

  const filtered = query.trim() !== "" || selected.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
        <p className="plate text-muted" aria-live="polite">
          {filtered ? `${results.length} of ${lenses.length}` : lenses.length} lenses
        </p>
      </div>

      <div className="relative">
        <label htmlFor="library-search" className="sr-only">
          Search
        </label>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="text-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="m13 13 4 4" strokeLinecap="round" />
        </svg>
        <input
          id="library-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, category or keyword"
          enterKeyHint="search"
          autoComplete="off"
          className="border-rule bg-surface min-h-11 w-full rounded-sm border py-2.5 pr-4 pl-10 text-base"
        />
      </div>

      <div
        role="group"
        aria-label="Filter by category"
        className="scroll-row -mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        <button
          type="button"
          aria-pressed={selected.length === 0}
          onClick={() => setSelected([])}
          className={cn(CHIP, selected.length === 0 ? CHIP_ON : CHIP_OFF)}
        >
          All
        </button>
        {categories.map((category) => {
          const active = selected.includes(category);
          return (
            <button
              key={category}
              type="button"
              aria-pressed={active}
              onClick={() => toggleCategory(category)}
              className={cn(CHIP, active ? CHIP_ON : CHIP_OFF)}
            >
              {category}
            </button>
          );
        })}
      </div>

      {results.length === 0 ? (
        <div className="border-rule bg-surface space-y-3 border px-5 py-6">
          <p className="text-muted text-sm">
            No lenses match that search. Clear the filters or try a broader term.
          </p>
          <ActionButton variant="secondary" onClick={clearAll}>
            Clear search and filters
          </ActionButton>
        </div>
      ) : (
        <ul className="space-y-2">
          {results.map((lens) => (
            <li key={lens.id}>
              <LensCard lens={lens} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
