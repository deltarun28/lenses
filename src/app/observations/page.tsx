import type { Metadata } from "next";
import { ObservationList } from "@/components/observations/ObservationList";
import { lensRepository } from "@/repositories/content/filesystem-lens-repository";

export const metadata: Metadata = {
  title: "Observations",
  description: "Your saved notes, stored on this device.",
};

export default async function ObservationsPage() {
  const lenses = await lensRepository.listPublishedSummaries();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Observations</h1>
        <p className="text-muted text-sm">
          Your own notes against each lens, most recent first. They are stored on this
          device only.
        </p>
      </header>
      <ObservationList lenses={lenses} />
    </div>
  );
}
