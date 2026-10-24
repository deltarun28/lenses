"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { StatusMessage } from "@/components/ui/StatusMessage";

/**
 * Moves the reader to a specific day.
 *
 * This is also the recovery path: clearing browser storage resets the start
 * date, and setting the day here restores the sequence.
 */
export function DaySetter({
  currentDay,
  totalDays,
  onSetDay,
}: {
  currentDay: number;
  totalDays: number;
  onSetDay: (day: number) => void;
}) {
  const [value, setValue] = useState(String(currentDay));
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const submit = () => {
    const day = Number(value);
    if (!Number.isInteger(day) || day < 1) {
      setError("Enter a whole number of 1 or more.");
      setStatus("");
      return;
    }
    setError("");
    onSetDay(day);
    setStatus(`Moved to day ${day}.`);
  };

  return (
    <section
      aria-labelledby="day-setter-heading"
      className="border-rule space-y-3 border-t pt-6"
    >
      <h2 id="day-setter-heading" className="plate text-muted">
        Go to a day
      </h2>
      <p className="text-muted max-w-prose text-sm">
        Day 1 is the day you installed the app. Set a different day to catch up or to
        re-read earlier lenses. After day {totalDays}, the sequence starts again.
      </p>
      <div className="flex flex-wrap items-start gap-3">
        <div>
          <label htmlFor="day-input" className="sr-only">
            Day number
          </label>
          <input
            id="day-input"
            type="number"
            inputMode="numeric"
            min={1}
            value={value}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "day-input-error" : undefined}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
            className="border-rule bg-surface min-h-11 w-28 rounded-sm border px-3 py-2.5 font-mono text-base"
          />
        </div>
        <ActionButton variant="secondary" onClick={submit}>
          Go to day
        </ActionButton>
      </div>
      {error ? (
        <p id="day-input-error" className="text-accent text-sm">
          {error}
        </p>
      ) : null}
      <StatusMessage message={status} />
    </section>
  );
}
