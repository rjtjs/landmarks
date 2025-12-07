import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrecisionLevel } from "@landmarks/shared";
import { getItem, setItem, removeItem } from "../../src/utils/localStorage";

describe("localStorage utility", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("getItem", () => {
    it("returns null when key does not exist", () => {
      const result = getItem("theme");
      expect(result).toBeNull();
    });

    it("retrieves and parses theme from localStorage", () => {
      localStorage.setItem("theme", JSON.stringify("dark"));
      const result = getItem("theme");
      expect(result).toBe("dark");
    });

    it("retrieves and parses gameState from localStorage", () => {
      const gameState = {
        landmark: {
          id: "test",
          name: "Test Landmark",
          detailsUrl: "https://example.com",
          images: ["https://example.com/img.jpg"],
        },
        guessLocation: { lng: 2.3522, lat: 48.8566 },
        result: null,
        availablePrecisions: [
          PrecisionLevel.VAGUE,
          PrecisionLevel.NARROW,
          PrecisionLevel.EXACT,
        ],
        selectedPrecision: PrecisionLevel.VAGUE,
      };
      localStorage.setItem("gameState", JSON.stringify(gameState));
      const result = getItem("gameState");
      expect(result).toEqual(gameState);
    });

    it("returns null when localStorage contains invalid JSON", () => {
      localStorage.setItem("theme", "invalid-json");
      const result = getItem("theme");
      expect(result).toBeNull();
    });
  });

  describe("setItem", () => {
    it("stores theme in localStorage", () => {
      setItem("theme", "light");
      const stored = localStorage.getItem("theme");
      expect(JSON.parse(stored!)).toBe("light");
    });

    it("stores gameState with precision fields in localStorage", () => {
      const gameState = {
        landmark: {
          id: "taj",
          name: "Taj Mahal",
          detailsUrl: "https://example.com",
          images: ["https://example.com/taj.jpg"],
        },
        guessLocation: { lng: 78.0421, lat: 27.1751 },
        result: {
          isCorrect: true,
          achievedPrecision: PrecisionLevel.EXACT,
          actualLocation: { lng: 78.0421, lat: 27.1751 },
          distanceKm: 0.5,
          wikiSummary: "Test summary",
          wikiUrl: "https://example.com/wiki",
          availablePrecisions: [],
        },
        availablePrecisions: [],
        selectedPrecision: PrecisionLevel.EXACT,
      };
      setItem("gameState", gameState);
      const stored = localStorage.getItem("gameState");
      expect(JSON.parse(stored!)).toEqual(gameState);
    });

    it("stores gameState with retry-eligible result", () => {
      const gameState = {
        landmark: {
          id: "eiffel",
          name: "Eiffel Tower",
          detailsUrl: "https://example.com",
          images: ["https://example.com/eiffel.jpg"],
        },
        guessLocation: { lng: 2.2945, lat: 48.8584 },
        result: {
          isCorrect: true,
          achievedPrecision: PrecisionLevel.VAGUE,
          actualLocation: { lng: 2.2945, lat: 48.8584 },
          distanceKm: 200,
          wikiSummary: "Test summary",
          wikiUrl: "https://example.com/wiki",
          availablePrecisions: [PrecisionLevel.NARROW, PrecisionLevel.EXACT],
        },
        availablePrecisions: [PrecisionLevel.NARROW, PrecisionLevel.EXACT],
        selectedPrecision: PrecisionLevel.VAGUE,
      };
      setItem("gameState", gameState);
      const stored = localStorage.getItem("gameState");
      expect(JSON.parse(stored!)).toEqual(gameState);
    });
  });

  describe("removeItem", () => {
    it("removes theme from localStorage", () => {
      localStorage.setItem("theme", JSON.stringify("dark"));
      removeItem("theme");
      expect(localStorage.getItem("theme")).toBeNull();
    });

    it("removes gameState from localStorage", () => {
      const gameState = {
        landmark: null,
        guessLocation: null,
        result: null,
        availablePrecisions: [
          PrecisionLevel.VAGUE,
          PrecisionLevel.NARROW,
          PrecisionLevel.EXACT,
        ],
        selectedPrecision: PrecisionLevel.VAGUE,
      };
      localStorage.setItem("gameState", JSON.stringify(gameState));
      removeItem("gameState");
      expect(localStorage.getItem("gameState")).toBeNull();
    });
  });
});
