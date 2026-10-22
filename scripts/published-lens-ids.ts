import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * The ids of the published lenses, read the way the app reads them: a lens is
 * published when its frontmatter says `status: published` (see `isPublished` in
 * `src/domain/lenses/lens.ts`). `next.config.ts` uses this to decide which pages
 * the service worker precaches. A unit test checks it against the repository, so
 * the two cannot drift apart.
 */
export function publishedLensIds(directory: string): string[] {
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .flatMap((file) => {
      const { data }: { data: Record<string, unknown> } = matter(
        readFileSync(path.join(directory, file), "utf8"),
      );
      return data.status === "published" && typeof data.id === "string" ? [data.id] : [];
    });
}
