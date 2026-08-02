import type { Lens, LensSummary } from "@/domain/lenses/lens";

/**
 * The only way the application reads lens content.
 *
 * The MVP ships a filesystem implementation. An Obsidian vault, CMS, database
 * or remote API can be swapped in by implementing this interface — nothing in
 * `app/`, `components/` or `services/` knows where content comes from.
 */
export interface LensRepository {
  /** Published lenses only, ordered by `sequence`. */
  listPublished(): Promise<Lens[]>;
  /** Published lenses without bodies — safe to pass into client components. */
  listPublishedSummaries(): Promise<LensSummary[]>;
  /** Any lens by id, including drafts. Returns null when unknown. */
  getById(id: string): Promise<Lens | null>;
}
