import { TodayPanel } from "@/components/today/TodayPanel";
import { lensRepository } from "@/repositories/content/filesystem-lens-repository";

/**
 * Today's lens.
 *
 * The index is generated at build time; which lens is "today" is resolved in the
 * browser, because it depends on the device's local date and the user's stored
 * start date.
 */
export default async function TodayPage() {
  const lenses = await lensRepository.listPublishedSummaries();
  return <TodayPanel lenses={lenses} />;
}
