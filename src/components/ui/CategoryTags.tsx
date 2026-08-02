import type { LensCategory } from "@/domain/lenses/lens";

export function CategoryTags({ categories }: { categories: LensCategory[] }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1">
      {categories.map((category) => (
        <li key={category} className="plate text-muted">
          {category}
        </li>
      ))}
    </ul>
  );
}
