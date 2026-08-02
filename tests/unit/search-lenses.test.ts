import { describe, expect, it } from "vitest";
import type { LensSummary } from "@/domain/lenses/lens";
import { LENS_CATEGORIES } from "@/domain/lenses/lens";
import {
  availableCategories,
  matchesQuery,
  searchLenses,
  tokenize,
} from "@/services/search/search-lenses";

function lens(overrides: Partial<LensSummary>): LensSummary {
  return {
    id: "test-lens",
    title: "Test Lens",
    sequence: 1,
    categories: ["Foundations"],
    summary: "A summary.",
    keywords: [],
    relatedLensIds: [],
    publishedAt: "2026-08-03",
    status: "published",
    wordCount: 100,
    readingMinutes: 1,
    ...overrides,
  };
}

const library: LensSummary[] = [
  lens({
    id: "inversion",
    title: "Inversion",
    summary: "Work backwards from failure.",
    keywords: ["premortem", "planning"],
  }),
  lens({
    id: "goodharts-law",
    title: "Goodhart's Law",
    categories: ["Economics & Incentives"],
    summary: "When a measure becomes the target it stops being a good measure.",
    keywords: ["metrics", "kpi"],
  }),
  lens({
    id: "ooda-loop",
    title: "OODA Loop",
    categories: ["Foundations", "Military Thinking"],
    summary: "Observe, orient, decide, act.",
    keywords: ["tempo"],
  }),
];

describe("tokenize", () => {
  it("splits and lowercases, dropping empty tokens", () => {
    expect(tokenize("  OODA   Loop ")).toEqual(["ooda", "loop"]);
    expect(tokenize("   ")).toEqual([]);
  });
});

describe("matchesQuery", () => {
  it("matches on title, summary, category and keywords", () => {
    const target = library[1]!;
    expect(matchesQuery(target, "goodhart")).toBe(true);
    expect(matchesQuery(target, "measure")).toBe(true);
    expect(matchesQuery(target, "economics")).toBe(true);
    expect(matchesQuery(target, "kpi")).toBe(true);
  });

  it("is case-insensitive and requires every token to match", () => {
    const target = library[0]!;
    expect(matchesQuery(target, "INVERSION")).toBe(true);
    expect(matchesQuery(target, "inversion premortem")).toBe(true);
    expect(matchesQuery(target, "inversion tempo")).toBe(false);
  });

  it("matches everything on an empty query", () => {
    expect(matchesQuery(library[0]!, "")).toBe(true);
    expect(matchesQuery(library[0]!, "   ")).toBe(true);
  });
});

describe("searchLenses", () => {
  it("returns the whole library with no criteria", () => {
    expect(searchLenses(library)).toHaveLength(3);
  });

  it("filters by category", () => {
    const results = searchLenses(library, { categories: ["Military Thinking"] });
    expect(results.map((entry) => entry.id)).toEqual(["ooda-loop"]);
  });

  it("treats multiple categories as OR", () => {
    const results = searchLenses(library, {
      categories: ["Military Thinking", "Economics & Incentives"],
    });
    expect(results).toHaveLength(2);
  });

  it("combines query and category as AND", () => {
    expect(
      searchLenses(library, { query: "inversion", categories: ["Military Thinking"] }),
    ).toHaveLength(0);
    expect(
      searchLenses(library, { query: "observe", categories: ["Foundations"] }),
    ).toHaveLength(1);
  });

  it("returns an empty list rather than throwing on no match", () => {
    expect(searchLenses(library, { query: "zzzz" })).toEqual([]);
  });
});

describe("availableCategories", () => {
  it("returns only categories in use, in canonical order", () => {
    expect(availableCategories(library, LENS_CATEGORIES)).toEqual([
      "Foundations",
      "Economics & Incentives",
      "Military Thinking",
    ]);
  });
});
