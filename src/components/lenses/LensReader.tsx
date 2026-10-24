import {
  LENS_SECTION_HEADINGS,
  LENS_SECTION_LABELS,
  LENS_SECTION_ORDER,
  type LensContent,
  type LensSectionKey,
} from "@/domain/lenses/lens";
import { cn } from "@/lib/cn";

/**
 * The whole lens on one page, in reading order.
 *
 * A server component: reading needs no JavaScript, the browser's own scrolling,
 * find-in-page and heading navigation all work, and each section has an anchor
 * (`#questions`) so a reader can jump to it or link to it. The contents row is
 * plain links, one row that scrolls sideways on a phone, and can end with a link
 * to something after the lens, such as the reader's observation.
 */

interface ReaderSection {
  key: LensSectionKey;
  id: string;
  label: string;
  heading: string;
  html?: string;
  items?: string[];
}

/** `militaryExample` → `military-example`, used as the section's anchor. */
function anchorFor(key: LensSectionKey): string {
  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** Sections the lens actually has; an omitted worked example is not rendered. */
function buildSections(content: LensContent): ReaderSection[] {
  return LENS_SECTION_ORDER.filter(
    (key) => key === "questions" || content[key] !== null,
  ).map((key) => ({
    key,
    id: anchorFor(key),
    label: LENS_SECTION_LABELS[key],
    heading: LENS_SECTION_HEADINGS[key],
    html: key === "questions" ? undefined : (content[key] ?? undefined),
    items: key === "questions" ? content.questions : undefined,
  }));
}

export function LensReader({
  content,
  trailingLink,
}: {
  content: LensContent;
  trailingLink?: { href: string; label: string };
}) {
  const sections = buildSections(content);
  const links = [
    ...sections.map((section) => ({ href: `#${section.id}`, label: section.label })),
    ...(trailingLink ? [trailingLink] : []),
  ];

  return (
    <div className="space-y-8">
      <nav aria-label="Sections">
        <ol className="scroll-row -mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          {links.map((link) => (
            <li key={link.href} className="shrink-0">
              <a
                href={link.href}
                className="plate border-rule text-muted hover:text-ink inline-flex min-h-11 items-center rounded-sm border px-3 whitespace-nowrap transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map((section) => (
        <section
          key={section.key}
          id={section.id}
          aria-labelledby={`${section.id}-heading`}
          className={cn(
            "scroll-mt-4 space-y-3",
            section.key !== "principle" && "border-rule border-t pt-6",
          )}
        >
          <h2 id={`${section.id}-heading`} className="plate text-accent">
            {section.heading}
          </h2>
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
              className={cn(
                "lens-prose",
                // The principle is the lens in one sentence: set it apart.
                section.key === "principle" &&
                  "border-accent border-l-2 pl-4 text-[1.1875rem] leading-normal",
              )}
              // Content is authored in this repository and rendered at build time.
              dangerouslySetInnerHTML={{ __html: section.html ?? "" }}
            />
          )}
        </section>
      ))}
    </div>
  );
}
