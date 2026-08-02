import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/search/LibraryBrowser";
import { lensRepository } from "@/repositories/content/filesystem-lens-repository";

export const metadata: Metadata = {
  title: "Library",
  description: "Every published lens, searchable by title, category or keyword.",
};

export default async function LibraryPage() {
  const lenses = await lensRepository.listPublishedSummaries();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
        <p className="text-muted text-sm">
          Every published lens. Read them in any order.
        </p>
      </header>
      <LibraryBrowser lenses={lenses} />
    </div>
  );
}
