import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import * as api from "../../src/services/api";
import { mockMap, mockMarker, simulateMapClick } from "../helpers/mapMocks";
import {
  EIFFEL_TOWER_WITHOUT_LOCATION,
  EXACT_CORRECT_RESULT,
  NARROW_CORRECT_RESULT,
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

describe("App - Guess Submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getRandomLandmark).mockResolvedValue(
      EIFFEL_TOWER_WITHOUT_LOCATION,
    );
  });

  it("shows submit button when guess location is selected", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    expect(screen.queryByText("Submit Guess")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
    });

    simulateMapClick(EIFFEL_LOCATION.lng, EIFFEL_LOCATION.lat);

    await waitFor(() => {
      expect(screen.getByText("Submit Guess")).toBeInTheDocument();
    });
  });

  it("submits exact precision guess and displays result", async () => {
    const user = userEvent.setup();
    vi.mocked(api.submitGuess).mockResolvedValue(EXACT_CORRECT_RESULT);

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
    });

    simulateMapClick(EIFFEL_LOCATION.lng, EIFFEL_LOCATION.lat);

    await waitFor(() => {
      expect(screen.getByText("Submit Guess")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Submit Guess"));

    await waitFor(() => {
      expect(screen.getByText("Eiffel Tower")).toBeInTheDocument();
      expect(
        screen.getByText("Correct at exact precision!"),
      ).toBeInTheDocument();
      expect(screen.getByText("1 km away")).toBeInTheDocument();
    });
  });

  it("submits narrow precision guess and shows result", async () => {
    const user = userEvent.setup();
    vi.mocked(api.submitGuess).mockResolvedValue(NARROW_CORRECT_RESULT);

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
        screen.getByText("Correct at narrow precision!"),
      ).toBeInTheDocument();
      expect(screen.getByText("75 km away")).toBeInTheDocument();
    });
  });

  it("submits vague precision guess and shows result", async () => {
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
        screen.getByText("Correct at vague precision!"),
      ).toBeInTheDocument();
      expect(screen.getByText("200 km away")).toBeInTheDocument();
    });
  });

  it("displays incorrect result when guess is wrong", async () => {
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
      expect(screen.getByText("Incorrect")).toBeInTheDocument();
      expect(screen.getByText("1500 km away")).toBeInTheDocument();
    });
  });

  it("landmark name is clickable link to Wikipedia", async () => {
    const user = userEvent.setup();
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
      const link = screen.getByRole("link", { name: "Eiffel Tower" });
      expect(link).toHaveAttribute(
        "href",
        "https://en.wikipedia.org/wiki/Eiffel_Tower",
      );
    });
  });
});
