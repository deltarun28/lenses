"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { Plate } from "@/components/ui/Plate";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { LensSummary } from "@/domain/lenses/lens";
import { formatIsoDate } from "@/lib/dates";
import { useClientSnapshot } from "@/lib/use-client-snapshot";
import { observationStore } from "@/repositories/observations/observation-store";

/** All saved observations, most recently updated first. */
export function ObservationList({ lenses }: { lenses: LensSummary[] }) {
  const observations = useSyncExternalStore(
    observationStore.subscribe,
    observationStore.getSnapshot,
    observationStore.getServerSnapshot,
  );
  const hydrated = useClientSnapshot(() => true) ?? false;
  const [status, setStatus] = useState("");

  const titleFor = (lensId: string) =>
    lenses.find((lens) => lens.id === lensId)?.title ?? lensId;

  const handleDelete = (lensId: string) => {
    const title = titleFor(lensId);
    observationStore.remove(lensId);
    setStatus(`Deleted your observation on ${title}.`);
  };

  if (!hydrated) {
    return <p className="text-muted text-sm">Loading your observations&hellip;</p>;
  }

  if (observations.length === 0) {
    return (
      <div className="border-rule bg-surface space-y-3 border px-5 py-6">
        <StatusMessage message={status} />
        <p className="text-muted text-sm">
          Nothing saved yet. Open a lens and write down where you saw it — one line is
          enough.
        </p>
        <Link href="/" className="text-accent text-sm underline underline-offset-4">
          Read today&rsquo;s lens
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <StatusMessage message={status} />
      <ul className="space-y-4">
        {observations.map((observation) => (
          <li
            key={observation.lensId}
            className="border-rule bg-surface space-y-3 border px-5 py-4"
          >
            <div className="flex items-baseline justify-between gap-4">
              <Link
                href={`/lenses/${observation.lensId}`}
                className="hover:text-accent font-semibold underline-offset-4 hover:underline"
              >
                {titleFor(observation.lensId)}
              </Link>
              <Plate>{formatIsoDate(observation.updatedAt.slice(0, 10))}</Plate>
            </div>
            <p className="lens-prose text-sm">{observation.text}</p>
            <ActionButton
              variant="quiet"
              onClick={() => handleDelete(observation.lensId)}
              aria-label={`Delete your observation on ${titleFor(observation.lensId)}`}
            >
              Delete
            </ActionButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
