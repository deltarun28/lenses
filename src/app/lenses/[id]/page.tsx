import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LensNav } from "@/components/lenses/LensNav";
import { LensStepper } from "@/components/lenses/LensStepper";
import { RelatedLenses } from "@/components/lenses/RelatedLenses";
import { ObservationEditor } from "@/components/observations/ObservationEditor";
import { CategoryTags } from "@/components/ui/CategoryTags";
import { Plate } from "@/components/ui/Plate";
import { lensRepository } from "@/repositories/content/filesystem-lens-repository";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Every published lens is pre-rendered, so pages are cacheable and work offline. */
export async function generateStaticParams() {
  const lenses = await lensRepository.listPublishedSummaries();
  return lenses.map((lens) => ({ id: lens.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const lens = await lensRepository.getById(id);
  if (!lens) return { title: "Not found" };
  return { title: lens.title, description: lens.summary };
}

export default async function LensPage({ params }: PageProps) {
  const { id } = await params;
  const lens = await lensRepository.getById(id);

  if (!lens || lens.status !== "published") {
    notFound();
  }

  const published = await lensRepository.listPublishedSummaries();
  const position = published.findIndex((entry) => entry.id === lens.id);
  const previous = position > 0 ? (published[position - 1] ?? null) : null;
  const next = position >= 0 ? (published[position + 1] ?? null) : null;
  const related = published.filter((entry) => lens.relatedLensIds.includes(entry.id));

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <CategoryTags categories={lens.categories} />
          <Plate>{lens.readingMinutes} min read</Plate>
        </div>
        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance">
          {lens.title}
        </h1>
        <p className="lens-prose text-muted">{lens.summary}</p>
      </header>

      <LensStepper content={lens.content} />

      <RelatedLenses related={related} />
      <ObservationEditor lensId={lens.id} />
      <LensNav previous={previous} next={next} />
    </article>
  );
}
