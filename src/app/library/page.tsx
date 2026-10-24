import type { Metadata } from "next";
import { LibraryBrowser } from "@/components/search/LibraryBrowser";
import { lensRepository } from "@/repositories/content/filesystem-lens-repository";

export const metadata: Metadata = {
  title: "Library",
  description: "Every published lens, searchable by title, category or keyword.",
};

export default async function LibraryPage() {
  const lenses = await lensRepository.listPublishedSummaries();

  // The heading lives inside the browser, on one line with the result count.
  return <LibraryBrowser lenses={lenses} />;
}
