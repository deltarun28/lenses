"use client";

import { useState, useSyncExternalStore } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { OBSERVATION_MAX_LENGTH } from "@/domain/observations/observation";
import { formatIsoDate } from "@/lib/dates";
import { useClientSnapshot } from "@/lib/use-client-snapshot";
import { observationStore } from "@/repositories/observations/observation-store";

/**
 * The user's note against one lens. At most one per lens: saving again updates
 * the existing note. Saved text comes from the store; `draft` holds unsaved
 * edits, so nothing is copied into state inside an effect.
 */
export function ObservationEditor({ lensId }: { lensId: string }) {
  const observations = useSyncExternalStore(
    observationStore.subscribe,
    observationStore.getSnapshot,
    observationStore.getServerSnapshot,
  );
  const hydrated = useClientSnapshot(() => true) ?? false;

  const saved = observations.find((observation) => observation.lensId === lensId) ?? null;
  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const text = draft ?? saved?.text ?? "";
  const trimmed = text.trim();

  const handleSave = () => {
    if (!trimmed) return;
    observationStore.save({ lensId, text: trimmed });
    setDraft(null);
    setStatus("Observation saved on this device.");
  };

  const handleDelete = () => {
    observationStore.remove(lensId);
    setDraft("");
    setStatus("Observation deleted.");
  };

  return (
    <section
      aria-labelledby="observation-heading"
      className="border-rule space-y-3 border-t pt-6"
    >
      <h2 id="observation-heading" className="plate text-muted">
        Your observation
      </h2>
      <p className="text-muted max-w-prose text-sm">
        Where did you see this today? Notes stay on this device.
      </p>

      <label htmlFor="observation-text" className="sr-only">
        Observation
      </label>
      <textarea
        id="observation-text"
        value={text}
        rows={4}
        maxLength={OBSERVATION_MAX_LENGTH}
        disabled={!hydrated}
        onChange={(event) => setDraft(event.target.value)}
        aria-describedby="observation-count"
        className="border-rule bg-surface w-full rounded-sm border px-4 py-3 text-sm"
        placeholder="One concrete example from today."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id="observation-count" className="plate text-muted">
          {text.length} / {OBSERVATION_MAX_LENGTH}
        </p>
        <div className="flex gap-3">
          {saved ? (
            <ActionButton variant="quiet" onClick={handleDelete}>
              Delete
            </ActionButton>
          ) : null}
          <ActionButton onClick={handleSave} disabled={!hydrated || !trimmed}>
            Save observation
          </ActionButton>
        </div>
      </div>

      {saved ? (
        <p className="plate text-muted">
          Last saved {formatIsoDate(saved.updatedAt.slice(0, 10))}
        </p>
      ) : null}
      <StatusMessage message={status} />
    </section>
  );
}
