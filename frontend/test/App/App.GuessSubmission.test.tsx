import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import App from "../../src/App";
import * as api from "../../src/services/api";
import { mockMap, mockMarker, simulateMapClick } from "../helpers/mapMocks";
import {
  EIFFEL_TOWER_WITHOUT_LOCATION,
  EXACT_CORRECT_RESULT,
  INCORRECT_RESULT,
  EIFFEL_LOCATION,
} from "../fixtures/landmarks";

vi.mock("mapbox-gl", () => ({
  default: {
    accessToken: "",
    Map: vi.fn(function Map() {
      return mockMap;
    }),
    Marker: vi.fn(function Marker() {
      return mockMarker;
    }),
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
      expect(screen.getByText("Eiffel Tower")).toBeInTheDocument();
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
