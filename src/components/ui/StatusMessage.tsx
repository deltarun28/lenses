/**
 * Polite live region. Always rendered so screen readers observe changes rather
 * than a node appearing; empty text simply announces nothing.
 */
export function StatusMessage({ message }: { message: string }) {
  return (
    <p role="status" aria-live="polite" className="text-muted min-h-5 text-sm">
      {message}
    </p>
  );
}
