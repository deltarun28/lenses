import path from "node:path";
import { describe, expect, it } from "vitest";
import { lensRepository } from "@/repositories/content/filesystem-lens-repository";
import { publishedLensIds } from "../../scripts/published-lens-ids";

describe("publishedLensIds", () => {
  it("lists exactly the lenses the repository publishes, so the precache matches the pages", async () => {
    const directory = path.join(process.cwd(), "src", "content", "lenses");
    const fromRepository = (await lensRepository.listPublishedSummaries())
      .map((lens) => lens.id)
      .sort();

    expect(publishedLensIds(directory).sort()).toEqual(fromRepository);
  });
});
