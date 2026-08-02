import { cn } from "@/lib/cn";

/**
 * The structural label used throughout: day numbers, section counters, category
 * tags. Mono and uppercase because in a manual these are navigation aids.
 */
export function Plate({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent" | "ink";
  className?: string;
}) {
  const toneClass =
    tone === "accent" ? "text-accent" : tone === "ink" ? "text-ink" : "text-muted";
  return <span className={cn("plate", toneClass, className)}>{children}</span>;
}
