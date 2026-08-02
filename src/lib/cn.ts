/** Joins class names, dropping falsy values. Deliberately tiny: no clsx dependency. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
