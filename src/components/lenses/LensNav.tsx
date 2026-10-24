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
      className="border-rule grid gap-1 border-t pt-4 sm:grid-cols-2 sm:gap-3"
    >
      {previous ? (
        <Link href={`/lenses/${previous.id}`} className="group block py-2">
          <span className="plate text-muted">Previous</span>
          <span className="group-hover:text-accent block font-medium">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/lenses/${next.id}`} className="group block py-2 sm:text-right">
          <span className="plate text-muted">Next</span>
          <span className="group-hover:text-accent block font-medium">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
