import { describe, it, expect } from "vitest";
import { haversineDistance } from "../../src/utils/geographic";

describe("haversineDistance", () => {
  it("calculates zero distance for same points", () => {
    const dist = haversineDistance(0, 0, 0, 0);
    expect(dist).toBeCloseTo(0, 5);
  });

  it("calculates approx distance between Paris and London", () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const london = { lat: 51.5074, lng: -0.1278 };
    const dist = haversineDistance(paris.lat, paris.lng, london.lat, london.lng);
    expect(dist).toBeGreaterThan(340);
    expect(dist).toBeLessThan(350);
  });
});
