import { z } from "zod";
import { LENS_CATEGORIES } from "./lens";

/**
 * Validation for lens frontmatter. Runs when content is loaded (build time for
 * static pages), so a malformed file fails the build rather than the browser.
 */

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const lensFrontmatterSchema = z.object({
  id: z
    .string()
    .regex(idPattern, "id must be lowercase kebab-case, e.g. theory-of-constraints"),
  title: z.string().min(1),
  sequence: z.number().int().positive(),
  categories: z.array(z.enum(LENS_CATEGORIES)).min(1),
  summary: z.string().min(1).max(200),
  keywords: z.array(z.string().min(1)).default([]),
  related: z.array(z.string().regex(idPattern)).default([]),
  // YAML parses an unquoted date into a Date, and Obsidian writes them that way,
  // so both forms are accepted and normalised to YYYY-MM-DD.
  publishedAt: z.preprocess(
    (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt must be YYYY-MM-DD"),
  ),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type LensFrontmatter = z.infer<typeof lensFrontmatterSchema>;

export function formatValidationError(source: string, error: z.ZodError): string {
  const issues = error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  return `Invalid lens frontmatter in ${source}:\n${issues}`;
}
