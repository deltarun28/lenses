import { marked } from "marked";

/**
 * Markdown helpers for lens content.
 *
 * Lens bodies are plain Markdown with `## Heading` sections, so the same file
 * reads correctly in Obsidian, on GitHub, and in this app.
 */

marked.setOptions({ gfm: true, breaks: false });

/**
 * Splits a Markdown body into a map of `## Heading` -> body text.
 * Content before the first heading is ignored.
 */
export function splitSectionsByHeading(markdown: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = markdown.split(/\r?\n/);
  let heading: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (heading !== null) {
      sections.set(heading, buffer.join("\n").trim());
    }
    buffer = [];
  };

  for (const line of lines) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match) {
      flush();
      heading = match[1] ?? "";
      continue;
    }
    if (heading !== null) buffer.push(line);
  }
  flush();

  return sections;
}

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false });
}

/** Extracts `- item` / `1. item` lines as plain strings, for the Questions section. */
export function extractListItems(markdown: string): string[] {
  return markdown
    .split(/\r?\n/)
    .map((line) => /^\s*(?:[-*+]|\d+\.)\s+(.*)$/.exec(line)?.[1]?.trim())
    .filter((item): item is string => Boolean(item));
}

/** Strips Markdown syntax well enough to count words for the reading estimate. */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(
      /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
      (_match, target, alias) => alias ?? target,
    )
    .replace(/[#>*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
