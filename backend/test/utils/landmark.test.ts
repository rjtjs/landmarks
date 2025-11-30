import { describe, expect, it } from "vitest";
import { getWikiSummary } from "../../src/utils/landmark";

describe("getWikiSummary", () => {
  it("fetches wiki summary for valid URL", async () => {
    const wikiSummary = await getWikiSummary(
      "https://en.wikipedia.org/api/rest_v1/page/summary/Eiffel_Tower"
    );
    expect(wikiSummary).toHaveProperty("extract");
  });
});
