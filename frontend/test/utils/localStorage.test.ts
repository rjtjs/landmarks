import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrecisionLevel } from "@landmarks/shared";
import {
  getGameState,
  setGameState,
  removeGameState,
  getTheme,
  setTheme,
  removeTheme,
} from "../../src/utils/localStorage";

describe("localStorage utility", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("theme", () => {
    it("returns null when theme does not exist", () => {
      expect(getTheme()).toBeNull();
    });

    it("retrieves theme from localStorage", () => {
      localStorage.setItem("theme", JSON.stringify("dark"));
      expect(getTheme()).toBe("dark");
    });

    it("stores theme in localStorage", () => {
      setTheme("light");
      const stored = localStorage.getItem("theme");
      expect(JSON.parse(stored!)).toBe("light");
    });

    it("removes theme from localStorage", () => {
      localStorage.setItem("theme", JSON.stringify("dark"));
      removeTheme();
      expect(localStorage.getItem("theme")).toBeNull();
    });

    it("returns null for invalid theme JSON", () => {
      localStorage.setItem("theme", "invalid-json");
      expect(getTheme()).toBeNull();
    });

    it("removes corrupted theme data", () => {
      localStorage.setItem("theme", "invalid-json");
      getTheme();
      expect(localStorage.getItem("theme")).toBeNull();
    });
  });

  describe("gameState", () => {
    it("returns null when gameState does not exist", () => {
      expect(getGameState()).toBeNull();
    });

    it("retrieves gameState from localStorage", () => {
      const gameState = {
        landmark: {
          id: "test",
          name: "Test Landmark",
          detailsUrl: "https://example.com",
          images: ["https://example.com/img.jpg"],
        },
        guessLocation: { lng: 2.3522, lat: 48.8566 },
        result: null,
        selectedPrecision: PrecisionLevel.VAGUE,
      };
      localStorage.setItem("gameState", JSON.stringify(gameState));
      expect(getGameState()).toEqual(gameState);
    });

    it("stores gameState in localStorage", () => {
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
        },
        selectedPrecision: PrecisionLevel.EXACT,
      };
      setGameState(gameState);
      const stored = localStorage.getItem("gameState");
      expect(JSON.parse(stored!)).toEqual(gameState);
    });

    it("removes gameState from localStorage", () => {
      const gameState = {
        landmark: null,
        guessLocation: null,
        result: null,
        selectedPrecision: PrecisionLevel.VAGUE,
      };
      localStorage.setItem("gameState", JSON.stringify(gameState));
      removeGameState();
      expect(localStorage.getItem("gameState")).toBeNull();
    });

    it("returns null for invalid gameState JSON", () => {
      localStorage.setItem("gameState", "invalid-json");
      expect(getGameState()).toBeNull();
    });

    it("removes corrupted gameState data", () => {
      localStorage.setItem("gameState", "invalid-json");
      getGameState();
      expect(localStorage.getItem("gameState")).toBeNull();
    });
  });
});
