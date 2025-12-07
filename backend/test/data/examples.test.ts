import { describe, it, expect } from "vitest";
import { getRandomLandmark, getLandmarkById } from "../../src/data/examples";

describe("landmarks data", () => {
  it("returns a random landmark from the list", () => {
    const landmark = getRandomLandmark();
    expect(landmark).toHaveProperty("id");
    expect(landmark).toHaveProperty("name");
    expect(landmark).toHaveProperty("location");
  });

  it("gets landmark by valid id", () => {
    const landmark = getLandmarkById("eiffel");
    expect(landmark).toBeDefined();
    expect(landmark?.name).toBe("Eiffel Tower");
  });

  it("returns undefined for invalid id", () => {
    const landmark = getLandmarkById("invalid-id");
    expect(landmark).toBeUndefined();
  });
});
