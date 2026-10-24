import Link from "next/link";
import type { LensSummary } from "@/domain/lenses/lens";

export function RelatedLenses({ related }: { related: LensSummary[] }) {
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="border-rule border-t pt-6">
      <h2 id="related-heading" className="plate text-muted">
        Related lenses
      </h2>
      {/*
        The link covers its whole row, summary included, so the touch target is
        the full entry while the accessible name stays the title alone.
      */}
      <ul className="divide-rule mt-2 divide-y">
        {related.map((lens) => (
          <li key={lens.id} className="group relative py-3">
            <Link
              href={`/lenses/${lens.id}`}
              className="group-hover:text-accent block font-medium underline-offset-4 group-hover:underline after:absolute after:inset-0"
            >
              {lens.title}
            </Link>
            <p className="text-muted text-sm">{lens.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
