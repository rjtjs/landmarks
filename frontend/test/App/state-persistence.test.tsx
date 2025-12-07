import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { PrecisionLevel } from "@landmarks/shared";
import App from "../../src/App";
import * as api from "../../src/services/api";
import * as localStorageUtils from "../../src/utils/localStorage";
import { mockMap, mockMarker, simulateMapClick } from "../helpers/mapMocks";
import {
  EIFFEL_TOWER_WITHOUT_LOCATION,
  EXACT_CORRECT_RESULT,
  VAGUE_CORRECT_RESULT,
  EIFFEL_LOCATION,
} from "../fixtures/landmarks";

vi.mock("mapbox-gl", () => ({
  default: {
    accessToken: "",
    Map: vi.fn(() => mockMap),
    Marker: vi.fn(() => mockMarker),
  },
}));

vi.mock("../../src/services/api");

vi.mock("../../src/contexts/ThemeContext", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: "light",
    toggleTheme: vi.fn(),
  }),
}));

describe("App - State Persistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getRandomLandmark).mockResolvedValue(
      EIFFEL_TOWER_WITHOUT_LOCATION,
    );
  });

  it("restores game state from localStorage on mount", async () => {
    const savedState = {
      landmark: EIFFEL_TOWER_WITHOUT_LOCATION,
      guessLocation: EIFFEL_LOCATION,
      result: null,
      availablePrecisions: [
        PrecisionLevel.VAGUE,
        PrecisionLevel.NARROW,
        PrecisionLevel.EXACT,
      ],
      selectedPrecision: PrecisionLevel.VAGUE,
    };

    vi.spyOn(localStorageUtils, "getItem").mockReturnValue(savedState);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByAltText("Eiffel Tower 1")).toBeInTheDocument();
    });

    expect(api.getRandomLandmark).not.toHaveBeenCalled();
  });

  it("loads new landmark when no saved state exists", async () => {
    vi.spyOn(localStorageUtils, "getItem").mockReturnValue(null);

    render(<App />);

    await waitFor(() => {
      expect(api.getRandomLandmark).toHaveBeenCalled();
    });
  });

  it("persists game state to localStorage when landmark is loaded", async () => {
    const setItemSpy = vi.spyOn(localStorageUtils, "setItem");

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(
        "gameState",
        expect.objectContaining({
          landmark: EIFFEL_TOWER_WITHOUT_LOCATION,
          guessLocation: null,
          result: null,
        }),
      );
    });
  });

  it("persists game state when guess location is selected", async () => {
    const setItemSpy = vi.spyOn(localStorageUtils, "setItem");

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    simulateMapClick(EIFFEL_LOCATION.lng, EIFFEL_LOCATION.lat);

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(
        "gameState",
        expect.objectContaining({
          guessLocation: EIFFEL_LOCATION,
        }),
      );
    });
  });

  it("persists game state with result after submitting guess", async () => {
    const user = userEvent.setup();
    const setItemSpy = vi.spyOn(localStorageUtils, "setItem");

    vi.mocked(api.submitGuess).mockResolvedValue(EXACT_CORRECT_RESULT);

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    simulateMapClick(EIFFEL_LOCATION.lng, EIFFEL_LOCATION.lat);

    await waitFor(() => {
      expect(screen.getByText("Submit Guess")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Submit Guess"));

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(
        "gameState",
        expect.objectContaining({
          result: EXACT_CORRECT_RESULT,
        }),
      );
    });
  });

  it("restores complete game state including result", async () => {
    const savedState = {
      landmark: EIFFEL_TOWER_WITHOUT_LOCATION,
      guessLocation: EIFFEL_LOCATION,
      result: VAGUE_CORRECT_RESULT,
      availablePrecisions: [PrecisionLevel.NARROW, PrecisionLevel.EXACT],
      selectedPrecision: PrecisionLevel.VAGUE,
    };

    vi.spyOn(localStorageUtils, "getItem").mockReturnValue(savedState);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Eiffel Tower")).toBeInTheDocument();
      expect(screen.getByText("200 km away")).toBeInTheDocument();
      expect(
        screen.getByText("You can now try a more precise guess!"),
      ).toBeInTheDocument();
    });
  });
});
