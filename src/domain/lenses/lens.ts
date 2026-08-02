/**
 * The domain vocabulary for a "lens" — one practical thinking tool.
 *
 * The heading strings below are the contract between Markdown files and the
 * application. Changing one is a breaking content change: every lens file must
 * be updated in the same commit, or content validation will fail the build.
 */

export const LENS_CATEGORIES = [
  "Foundations",
  "Economics & Incentives",
  "Probability & Risk",
  "Systems Thinking",
  "Strategy",
  "Leadership",
  "Military Thinking",
  "Psychology",
  "Negotiation",
  "AI & Technology",
  "Product Thinking",
] as const;

export type LensCategory = (typeof LENS_CATEGORIES)[number];

/** Maps a content field to the exact `## Heading` expected in a lens file. */
export const LENS_SECTION_HEADINGS = {
  principle: "Principle",
  explanation: "Explanation",
  militaryExample: "Military Example",
  leadershipExample: "Leadership Example",
  productExample: "Product Example",
  questions: "Questions",
  commonMisuse: "Common Misuse",
} as const;

export type LensSectionKey = keyof typeof LENS_SECTION_HEADINGS;

/** Reading order of the stepper. Related lenses are appended from frontmatter. */
export const LENS_SECTION_ORDER: readonly LensSectionKey[] = [
  "principle",
  "explanation",
  "militaryExample",
  "leadershipExample",
  "productExample",
  "questions",
  "commonMisuse",
] as const;

/** Short labels used in the stepper UI. */
export const LENS_SECTION_LABELS: Record<LensSectionKey, string> = {
  principle: "Principle",
  explanation: "Explanation",
  militaryExample: "Military",
  leadershipExample: "Leadership",
  productExample: "Product",
  questions: "Questions",
  commonMisuse: "Common misuse",
};

export type LensStatus = "draft" | "published";

/** Prose sections hold rendered HTML; questions stay a list so the UI can format it. */
export interface LensContent {
  principle: string;
  explanation: string;
  militaryExample: string;
  leadershipExample: string;
  productExample: string;
  questions: string[];
  commonMisuse: string;
}

/** Everything about a lens except its body — the shape sent to client components. */
export interface LensSummary {
  id: string;
  title: string;
  sequence: number;
  categories: LensCategory[];
  summary: string;
  keywords: string[];
  relatedLensIds: string[];
  publishedAt: string;
  status: LensStatus;
  wordCount: number;
  readingMinutes: number;
}

export interface Lens extends LensSummary {
  content: LensContent;
}

export function toLensSummary(lens: Lens): LensSummary {
  return {
    id: lens.id,
    title: lens.title,
    sequence: lens.sequence,
    categories: lens.categories,
    summary: lens.summary,
    keywords: lens.keywords,
    relatedLensIds: lens.relatedLensIds,
    publishedAt: lens.publishedAt,
    status: lens.status,
    wordCount: lens.wordCount,
    readingMinutes: lens.readingMinutes,
  };
}

export function isPublished(lens: LensSummary): boolean {
  return lens.status === "published";
}

export function bySequence(a: LensSummary, b: LensSummary): number {
  return a.sequence - b.sequence;
}
