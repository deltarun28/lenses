"use client";

import { useMemo, useState } from "react";
import { LensCard } from "@/components/lenses/LensCard";
import { Plate } from "@/components/ui/Plate";
import {
  LENS_CATEGORIES,
  type LensCategory,
  type LensSummary,
} from "@/domain/lenses/lens";
import { cn } from "@/lib/cn";
import { availableCategories, searchLenses } from "@/services/search/search-lenses";

/** Client-side search and category filtering over the published index. */
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

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="library-search" className="plate text-muted block">
          Search
        </label>
        <input
          id="library-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Title, category or keyword"
          className="border-rule bg-surface w-full rounded-sm border px-4 py-3 text-sm"
        />
      </div>

      <div className="space-y-2">
        <p className="plate text-muted" id="category-filter-label">
          Filter by category
        </p>
        <div
          role="group"
          aria-labelledby="category-filter-label"
          className="flex flex-wrap gap-1.5"
        >
          {categories.map((category) => {
            const active = selected.includes(category);
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCategory(category)}
                className={cn(
                  "plate rounded-sm px-2.5 py-1.5 transition-colors",
                  active
                    ? "bg-accent text-accent-ink"
                    : "border-rule text-muted hover:text-ink border",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <Plate>
        {results.length} of {lenses.length} lenses
      </Plate>

      {results.length === 0 ? (
        <p className="border-rule bg-surface text-muted border px-5 py-6 text-sm">
          No lenses match that search. Clear the filters or try a broader term.
        </p>
      ) : (
        <ul className="space-y-3">
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
