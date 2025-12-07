import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import * as api from "../../src/services/api";
import { mockMap, mockMarker, simulateMapClick } from "../helpers/mapMocks";
import {
  EIFFEL_TOWER_WITHOUT_LOCATION,
  TAJ_MAHAL_WITHOUT_LOCATION,
  VAGUE_CORRECT_RESULT,
  INCORRECT_RESULT,
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

describe("App - Retry Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getRandomLandmark).mockResolvedValue(
      EIFFEL_TOWER_WITHOUT_LOCATION,
    );
  });

  it("allows retry after correct guess at vague precision", async () => {
    const user = userEvent.setup();
    vi.mocked(api.submitGuess).mockResolvedValue(VAGUE_CORRECT_RESULT);

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
      expect(
        screen.getByText("You can now try a more precise guess!"),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Play Again")).not.toBeInTheDocument();
  });

  it("does not allow retry after incorrect guess", async () => {
    const user = userEvent.setup();
    vi.mocked(api.submitGuess).mockResolvedValue(INCORRECT_RESULT);

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    simulateMapClick(0, 0);

    await waitFor(() => {
      expect(screen.getByText("Submit Guess")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Submit Guess"));

    await waitFor(() => {
      expect(screen.getByText("Play Again")).toBeInTheDocument();
    });

    expect(
      screen.queryByText("You can now try a more precise guess!"),
    ).not.toBeInTheDocument();
  });

  it("allows playing again and loads new landmark", async () => {
    const user = userEvent.setup();
    vi.mocked(api.submitGuess).mockResolvedValue(INCORRECT_RESULT);

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    simulateMapClick(0, 0);

    await waitFor(() => {
      expect(screen.getByText("Submit Guess")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Submit Guess"));

    await waitFor(() => {
      expect(screen.getByText("Play Again")).toBeInTheDocument();
    });

    vi.mocked(api.getRandomLandmark).mockResolvedValue(
      TAJ_MAHAL_WITHOUT_LOCATION,
    );

    await user.click(screen.getByText("Play Again"));

    await waitFor(() => {
      expect(api.getRandomLandmark).toHaveBeenCalledTimes(2);
    });
  });

  it("clears guess location after successful retry-eligible guess", async () => {
    const user = userEvent.setup();
    vi.mocked(api.submitGuess).mockResolvedValue(VAGUE_CORRECT_RESULT);

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
      expect(
        screen.getByText("You can now try a more precise guess!"),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Submit Guess")).not.toBeInTheDocument();
  });
});
