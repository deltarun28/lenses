"use client";

import { useCallback, useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { Plate } from "@/components/ui/Plate";
import {
  LENS_SECTION_HEADINGS,
  LENS_SECTION_LABELS,
  LENS_SECTION_ORDER,
  type LensContent,
} from "@/domain/lenses/lens";
import { cn } from "@/lib/cn";

/**
 * Card stepper for a lens.
 *
 * One section at a time, with a jump control for direct access. Everything is a
 * real button, so the whole component works from the keyboard; left and right
 * arrows move between sections when focus is inside the stepper.
 */

interface StepperSection {
  key: string;
  label: string;
  heading: string;
  html?: string;
  items?: string[];
}

function buildSections(content: LensContent): StepperSection[] {
  return LENS_SECTION_ORDER.map((key) => ({
    key,
    label: LENS_SECTION_LABELS[key],
    heading: LENS_SECTION_HEADINGS[key],
    html: key === "questions" ? undefined : content[key],
    items: key === "questions" ? content.questions : undefined,
  }));
}

export function LensStepper({ content }: { content: LensContent }) {
  const sections = useMemo(() => buildSections(content), [content]);
  const [index, setIndex] = useState(0);
  const section = sections[index];

  const move = useCallback(
    (delta: number) => {
      setIndex((current) => Math.min(sections.length - 1, Math.max(0, current + delta)));
    },
    [sections.length],
  );

  if (!section) return null;

  const isFirst = index === 0;
  const isLast = index === sections.length - 1;

  return (
    <div
      className="space-y-4"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") move(1);
        if (event.key === "ArrowLeft") move(-1);
      }}
    >
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Jump to section">
        {sections.map((entry, entryIndex) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setIndex(entryIndex)}
            aria-current={entryIndex === index ? "true" : undefined}
            className={cn(
              "plate rounded-sm px-2 py-1 transition-colors",
              entryIndex === index
                ? "bg-accent text-accent-ink"
                : "text-muted hover:text-ink border-rule border",
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <section
        aria-labelledby="section-heading"
        aria-live="polite"
        className="border-rule bg-surface min-h-64 border"
      >
        <div className="border-rule flex items-baseline justify-between border-b px-5 py-3">
          <h2 id="section-heading" className="plate text-ink">
            {section.heading}
          </h2>
          <Plate>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(sections.length).padStart(2, "0")}
          </Plate>
        </div>

        <div className="px-5 py-6">
          {section.items ? (
            <ol className="lens-prose space-y-4">
              {section.items.map((item, itemIndex) => (
                <li key={item} className="flex gap-3">
                  <span className="plate text-accent shrink-0 pt-1.5">
                    {String(itemIndex + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div
              className="lens-prose"
              // Content is authored in this repository and rendered at build time.
              dangerouslySetInnerHTML={{ __html: section.html ?? "" }}
            />
          )}
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <ActionButton variant="secondary" onClick={() => move(-1)} disabled={isFirst}>
          Previous
        </ActionButton>
        <ActionButton onClick={() => move(1)} disabled={isLast}>
          Next section
        </ActionButton>
      </div>
    </div>
  );
}
