import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  LENS_SECTION_HEADINGS,
  LENS_SECTION_ORDER,
  bySequence,
  isPublished,
  toLensSummary,
  type Lens,
  type LensContent,
  type LensSummary,
} from "@/domain/lenses/lens";
import { formatValidationError, lensFrontmatterSchema } from "@/domain/lenses/schema";
import {
  extractListItems,
  renderMarkdown,
  splitSectionsByHeading,
  toPlainText,
} from "@/lib/markdown";
import { countWords, readingMinutesFromWordCount } from "@/lib/reading-time";
import type { LensRepository } from "./lens-repository";

/**
 * Reads lenses from `src/content/lenses/*.md`.
 *
 * Server-only: this module touches the filesystem and must never be imported
 * from a client component.
 */

const CONTENT_DIRECTORY = path.join(process.cwd(), "src", "content", "lenses");

function parseLensFile(source: string, raw: string): Lens {
  const { data, content } = matter(raw);
  const parsed = lensFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(formatValidationError(source, parsed.error));
  }

  const sections = splitSectionsByHeading(content);
  const missing = LENS_SECTION_ORDER.filter(
    (key) => !sections.get(LENS_SECTION_HEADINGS[key]),
  ).map((key) => LENS_SECTION_HEADINGS[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required section(s) in ${source}: ${missing.join(", ")}.\n` +
        `Every lens file needs a "## " heading for each of: ` +
        `${LENS_SECTION_ORDER.map((key) => LENS_SECTION_HEADINGS[key]).join(", ")}.`,
    );
  }

  const sectionMarkdown = (key: (typeof LENS_SECTION_ORDER)[number]): string =>
    sections.get(LENS_SECTION_HEADINGS[key]) ?? "";

  const questions = extractListItems(sectionMarkdown("questions"));
  if (questions.length === 0) {
    throw new Error(`The "Questions" section in ${source} must be a Markdown list.`);
  }

  const contentModel: LensContent = {
    principle: renderMarkdown(sectionMarkdown("principle")),
    explanation: renderMarkdown(sectionMarkdown("explanation")),
    militaryExample: renderMarkdown(sectionMarkdown("militaryExample")),
    leadershipExample: renderMarkdown(sectionMarkdown("leadershipExample")),
    productExample: renderMarkdown(sectionMarkdown("productExample")),
    questions,
    commonMisuse: renderMarkdown(sectionMarkdown("commonMisuse")),
  };

  const wordCount = LENS_SECTION_ORDER.reduce(
    (total, key) => total + countWords(toPlainText(sectionMarkdown(key))),
    0,
  );

  return {
    id: parsed.data.id,
    title: parsed.data.title,
    sequence: parsed.data.sequence,
    categories: parsed.data.categories,
    summary: parsed.data.summary,
    keywords: parsed.data.keywords,
    relatedLensIds: parsed.data.related,
    publishedAt: parsed.data.publishedAt,
    status: parsed.data.status,
    wordCount,
    readingMinutes: readingMinutesFromWordCount(wordCount),
    content: contentModel,
  };
}

function assertCollectionIsValid(lenses: Lens[]): void {
  const ids = new Set<string>();
  const sequences = new Map<number, string>();

  for (const lens of lenses) {
    if (ids.has(lens.id)) {
      throw new Error(`Duplicate lens id: "${lens.id}".`);
    }
    ids.add(lens.id);

    const clash = sequences.get(lens.sequence);
    if (clash) {
      throw new Error(
        `Duplicate sequence ${lens.sequence} used by "${clash}" and "${lens.id}".`,
      );
    }
    sequences.set(lens.sequence, lens.id);
  }

  for (const lens of lenses) {
    for (const relatedId of lens.relatedLensIds) {
      if (!ids.has(relatedId)) {
        throw new Error(`"${lens.id}" links to unknown related lens "${relatedId}".`);
      }
    }
  }
}

async function loadAll(): Promise<Lens[]> {
  const entries = await readdir(CONTENT_DIRECTORY);
  const files = entries.filter((entry) => entry.endsWith(".md")).sort();

  const lenses = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(CONTENT_DIRECTORY, file), "utf8");
      return parseLensFile(file, raw);
    }),
  );

  assertCollectionIsValid(lenses);
  return lenses.sort(bySequence);
}

// Loaded once per process. Next.js re-evaluates modules between builds, and the
// dev server reloads on content change, so a plain module-level cache is enough.
let cache: Promise<Lens[]> | null = null;

function allLenses(): Promise<Lens[]> {
  cache ??= loadAll();
  return cache;
}

export const filesystemLensRepository: LensRepository = {
  async listPublished(): Promise<Lens[]> {
    return (await allLenses()).filter(isPublished);
  },
  async listPublishedSummaries(): Promise<LensSummary[]> {
    return (await allLenses()).filter(isPublished).map(toLensSummary);
  },
  async getById(id: string): Promise<Lens | null> {
    return (await allLenses()).find((lens) => lens.id === id) ?? null;
  },
};

/** Single place to swap the content source for the whole app. */
export const lensRepository: LensRepository = filesystemLensRepository;

/** Exposed for tests so parsing can be exercised without touching the filesystem. */
export const __testing = { parseLensFile, assertCollectionIsValid };
