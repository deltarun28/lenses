import Link from "next/link";
import type { LensSummary } from "@/domain/lenses/lens";

/** Sequence-order navigation between lenses. */
export function LensNav({
  previous,
  next,
}: {
  previous: LensSummary | null;
  next: LensSummary | null;
}) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Lens sequence"
      className="border-rule grid gap-3 border-t pt-6 sm:grid-cols-2"
    >
      {previous ? (
        <Link href={`/lenses/${previous.id}`} className="group">
          <span className="plate text-muted">Previous</span>
          <span className="group-hover:text-accent block font-medium">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/lenses/${next.id}`} className="group sm:text-right">
          <span className="plate text-muted">Next</span>
          <span className="group-hover:text-accent block font-medium">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
