import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4">
      <p className="plate text-accent">Not found</p>
      <h1 className="text-2xl font-semibold tracking-tight">No lens at this address</h1>
      <p className="lens-prose text-muted">
        The lens may have been renamed, or the link may be wrong.
      </p>
      <Link href="/library" className="text-accent underline underline-offset-4">
        Browse the library
      </Link>
    </div>
  );
}
