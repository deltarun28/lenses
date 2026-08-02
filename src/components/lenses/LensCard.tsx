import Link from "next/link";
import { CategoryTags } from "@/components/ui/CategoryTags";
import { Plate } from "@/components/ui/Plate";
import type { LensSummary } from "@/domain/lenses/lens";

export function LensCard({ lens }: { lens: LensSummary }) {
  return (
    <article className="border-rule bg-surface hover:border-accent border transition-colors">
      <Link href={`/lenses/${lens.id}`} className="block space-y-2 px-5 py-4">
        <div className="flex items-baseline justify-between gap-4">
          <CategoryTags categories={lens.categories} />
          <Plate>{lens.readingMinutes} min</Plate>
        </div>
        <h3 className="text-lg font-semibold tracking-tight">{lens.title}</h3>
        <p className="text-muted text-sm">{lens.summary}</p>
      </Link>
    </article>
  );
}
