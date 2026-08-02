import { describe, expect, it } from "vitest";
import { LENS_SECTION_ORDER } from "@/domain/lenses/lens";
import {
  __testing,
  lensRepository,
} from "@/repositories/content/filesystem-lens-repository";

const { parseLensFile, assertCollectionIsValid } = __testing;

const frontmatter = `---
id: sample-lens
title: Sample Lens
sequence: 1
categories:
  - Foundations
summary: A short summary.
keywords:
  - sample
related: []
publishedAt: 2026-08-03
status: published
---`;

function fileWithSections(sections: string[]): string {
  return `${frontmatter}\n\n${sections.join("\n\n")}\n`;
}

const allSections = [
  "## Principle\n\nThe principle.",
  "## Explanation\n\nThe explanation.",
  "## Military Example\n\nA military example.",
  "## Leadership Example\n\nA leadership example.",
  "## Product Example\n\nA product example.",
  "## Questions\n\n- First question?\n- Second question?",
  "## Common Misuse\n\nThe limitations.",
];

describe("parseLensFile", () => {
  it("parses frontmatter, sections and reading time", () => {
    const lens = parseLensFile("sample.md", fileWithSections(allSections));
    expect(lens.id).toBe("sample-lens");
    expect(lens.categories).toEqual(["Foundations"]);
    expect(lens.content.principle).toContain("The principle.");
    expect(lens.content.questions).toEqual(["First question?", "Second question?"]);
    expect(lens.readingMinutes).toBeGreaterThanOrEqual(1);
  });

  it("rejects invalid frontmatter with a message naming the file", () => {
    const broken = fileWithSections(allSections).replace("sequence: 1", "sequence: zero");
    expect(() => parseLensFile("broken.md", broken)).toThrow(/broken\.md/);
  });

  it("rejects an unknown category", () => {
    const broken = fileWithSections(allSections).replace(
      "  - Foundations",
      "  - Astrology",
    );
    expect(() => parseLensFile("broken.md", broken)).toThrow();
  });

  it("rejects a file missing a required section", () => {
    const withoutMisuse = allSections.slice(0, -1);
    expect(() => parseLensFile("missing.md", fileWithSections(withoutMisuse))).toThrow(
      /Common Misuse/,
    );
  });

  it("rejects a Questions section that is not a list", () => {
    const prose = allSections.map((section) =>
      section.startsWith("## Questions") ? "## Questions\n\nJust prose." : section,
    );
    expect(() => parseLensFile("prose.md", fileWithSections(prose))).toThrow(/Questions/);
  });
});

describe("assertCollectionIsValid", () => {
  const base = parseLensFile("sample.md", fileWithSections(allSections));

  it("rejects duplicate ids", () => {
    expect(() => assertCollectionIsValid([base, { ...base, sequence: 2 }])).toThrow(
      /Duplicate lens id/,
    );
  });

  it("rejects duplicate sequence numbers", () => {
    expect(() => assertCollectionIsValid([base, { ...base, id: "other" }])).toThrow(
      /Duplicate sequence/,
    );
  });

  it("rejects related links to unknown lenses", () => {
    expect(() =>
      assertCollectionIsValid([{ ...base, relatedLensIds: ["does-not-exist"] }]),
    ).toThrow(/unknown related lens/);
  });
});

describe("the shipped content library", () => {
  it("loads, validates and is ordered by sequence", async () => {
    const lenses = await lensRepository.listPublished();
    expect(lenses.length).toBeGreaterThanOrEqual(15);
    const sequences = lenses.map((lens) => lens.sequence);
    expect([...sequences].sort((a, b) => a - b)).toEqual(sequences);
  });

  it("gives every lens all required sections and a reading estimate", async () => {
    const lenses = await lensRepository.listPublished();
    for (const lens of lenses) {
      for (const key of LENS_SECTION_ORDER) {
        const value = lens.content[key];
        expect(
          Array.isArray(value) ? value.length : value.length,
          lens.id,
        ).toBeGreaterThan(0);
      }
      expect(lens.readingMinutes, lens.id).toBeGreaterThanOrEqual(1);
    }
  });

  it("resolves every related link", async () => {
    const lenses = await lensRepository.listPublished();
    const ids = new Set(lenses.map((lens) => lens.id));
    for (const lens of lenses) {
      for (const related of lens.relatedLensIds) {
        expect(ids.has(related), `${lens.id} -> ${related}`).toBe(true);
      }
    }
  });
});
