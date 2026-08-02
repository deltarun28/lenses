import Link from "next/link";
import type { LensSummary } from "@/domain/lenses/lens";

export function RelatedLenses({ related }: { related: LensSummary[] }) {
  if (related.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="border-rule space-y-3 border-t pt-6"
    >
      <h2 id="related-heading" className="plate text-muted">
        Related lenses
      </h2>
      <ul className="space-y-2">
        {related.map((lens) => (
          <li key={lens.id}>
            <Link
              href={`/lenses/${lens.id}`}
              className="hover:text-accent block font-medium underline-offset-4 hover:underline"
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
