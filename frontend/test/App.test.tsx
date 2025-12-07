import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import * as api from "../src/services/api";
import * as localStorageUtils from "../src/utils/localStorage";

type MapEventHandler = (event?: {
  lngLat: { lng: number; lat: number };
}) => void;

const mockMap = {
  on: vi.fn((event: string, handler: MapEventHandler) => {
    if (event === "load") {
      setTimeout(() => handler(), 0);
    }
  }),
  off: vi.fn(),
  remove: vi.fn(),
  getCanvas: vi.fn(() => document.createElement("canvas")),
  getSource: vi.fn(() => null),
  addSource: vi.fn(),
  removeSource: vi.fn(),
  addLayer: vi.fn(),
  removeLayer: vi.fn(),
};

const mockMarker = {
  setLngLat: vi.fn().mockReturnThis(),
  addTo: vi.fn().mockReturnThis(),
  remove: vi.fn(),
};

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

vi.mock("../src/services/api");

vi.mock("../src/contexts/ThemeContext", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: "light",
    toggleTheme: vi.fn(),
  }),
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getRandomLandmark).mockResolvedValue({
      id: "test-landmark",
      name: "Test Landmark",
      detailsUrl: "https://example.com",
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ],
    });
  });

  it("renders the app with correct heading", async () => {
    render(<App />);
    expect(screen.getByText("Where in the World?")).toBeInTheDocument();
  });

  it("loads and displays landmark images", async () => {
    render(<App />);

    await waitFor(() => {
      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(2);
    });

    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("src", "https://example.com/image1.jpg");
    expect(images[1]).toHaveAttribute("src", "https://example.com/image2.jpg");
  });

  it("displays loading state initially", () => {
    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays error state when landmark fails to load", async () => {
    vi.mocked(api.getRandomLandmark).mockRejectedValue(new Error("Failed"));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load landmark/)).toBeInTheDocument();
    });
  });

  it("shows submit button when guess location is selected", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    expect(screen.queryByText("Submit Guess")).not.toBeInTheDocument();
  });

  it("submits guess and displays result with landmark name", async () => {
    const user = userEvent.setup();

    vi.mocked(api.submitGuess).mockResolvedValue({
      correctness: "CORRECT",
      actualLocation: { lng: 2.2945, lat: 48.8584 },
      distanceKm: 0.5,
      wikiSummary: "Test summary",
      wikiUrl: "https://example.com/wiki",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
    });

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === "click",
    )?.[1];

    expect(clickHandler).toBeDefined();
    clickHandler!({ lngLat: { lng: 2.2945, lat: 48.8584 } });

    await waitFor(() => {
      expect(screen.getByText("Submit Guess")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Submit Guess"));

    await waitFor(() => {
      expect(screen.getByText("Test Landmark")).toBeInTheDocument();
      expect(screen.getByText("1 km away")).toBeInTheDocument();
    });
  });

  it("does not show correctness text in results", async () => {
    const user = userEvent.setup();

    vi.mocked(api.submitGuess).mockResolvedValue({
      correctness: "CORRECT",
      actualLocation: { lng: 2.2945, lat: 48.8584 },
      distanceKm: 0.5,
      wikiSummary: "Test summary",
      wikiUrl: "https://example.com/wiki",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === "click",
    )?.[1];
    clickHandler({ lngLat: { lng: 2.2945, lat: 48.8584 } });

    await waitFor(() => {
      expect(screen.getByText("Submit Guess")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Submit Guess"));

    await waitFor(() => {
      expect(screen.getByText("Test Landmark")).toBeInTheDocument();
    });

    expect(screen.queryByText("Correct!")).not.toBeInTheDocument();
    expect(screen.queryByText("Result")).not.toBeInTheDocument();
  });

  it("landmark name is clickable link to Wikipedia", async () => {
    const user = userEvent.setup();

    vi.mocked(api.submitGuess).mockResolvedValue({
      correctness: "CLOSE",
      actualLocation: { lng: 2.2945, lat: 48.8584 },
      distanceKm: 200,
      wikiSummary: "Test summary",
      wikiUrl: "https://example.com/wiki/test",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === "click",
    )?.[1];
    expect(clickHandler).toBeDefined();
    clickHandler!({ lngLat: { lng: 2, lat: 48 } });

    await waitFor(() => {
      expect(screen.getByText("Submit Guess")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Submit Guess"));

    await waitFor(() => {
      const link = screen.getByRole("link", { name: "Test Landmark" });
      expect(link).toHaveAttribute("href", "https://example.com/wiki/test");
    });
  });

  it("allows playing again after submitting guess", async () => {
    const user = userEvent.setup();

    vi.mocked(api.submitGuess).mockResolvedValue({
      correctness: "INCORRECT",
      actualLocation: { lng: 2.2945, lat: 48.8584 },
      distanceKm: 1500,
      wikiSummary: "Test summary",
      wikiUrl: "https://example.com/wiki",
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === "click",
    )?.[1];
    expect(clickHandler).toBeDefined();
    clickHandler!({ lngLat: { lng: 0, lat: 0 } });

    await waitFor(() => {
      expect(screen.getByText("Submit Guess")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Submit Guess"));

    await waitFor(() => {
      expect(screen.getByText("Play Again")).toBeInTheDocument();
    });

    vi.mocked(api.getRandomLandmark).mockResolvedValue({
      id: "new-landmark",
      name: "New Landmark",
      detailsUrl: "https://example.com",
      images: ["https://example.com/new-image.jpg"],
    });

    await user.click(screen.getByText("Play Again"));

    await waitFor(() => {
      expect(api.getRandomLandmark).toHaveBeenCalledTimes(2);
    });
  });

  describe("game state persistence", () => {
    it("restores game state from localStorage on mount", async () => {
      const savedState = {
        landmark: {
          id: "saved-landmark",
          name: "Saved Landmark",
          detailsUrl: "https://example.com",
          images: ["https://example.com/saved.jpg"],
        },
        guessLocation: { lng: 2.3522, lat: 48.8566 },
        result: null,
      };

      vi.spyOn(localStorageUtils, "getItem").mockReturnValue(savedState);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByAltText("Saved Landmark 1")).toBeInTheDocument();
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
        expect(setItemSpy).toHaveBeenCalledWith("gameState", {
          landmark: {
            id: "test-landmark",
            name: "Test Landmark",
            detailsUrl: "https://example.com",
            images: [
              "https://example.com/image1.jpg",
              "https://example.com/image2.jpg",
            ],
          },
          guessLocation: null,
          result: null,
        });
      });
    });

    it("persists game state when guess location is selected", async () => {
      const setItemSpy = vi.spyOn(localStorageUtils, "setItem");

      render(<App />);

      await waitFor(() => {
        expect(screen.getAllByRole("img")).toHaveLength(2);
      });

      const clickHandler = mockMap.on.mock.calls.find(
        (call) => call[0] === "click",
      )?.[1];
      expect(clickHandler).toBeDefined();
      clickHandler!({ lngLat: { lng: 2.2945, lat: 48.8584 } });

      await waitFor(() => {
        expect(setItemSpy).toHaveBeenCalledWith(
          "gameState",
          expect.objectContaining({
            guessLocation: { lng: 2.2945, lat: 48.8584 },
          }),
        );
      });
    });

    it("persists game state with result after submitting guess", async () => {
      const user = userEvent.setup();
      const setItemSpy = vi.spyOn(localStorageUtils, "setItem");

      vi.mocked(api.submitGuess).mockResolvedValue({
        correctness: "CORRECT",
        actualLocation: { lng: 2.2945, lat: 48.8584 },
        distanceKm: 0.5,
        wikiSummary: "Test summary",
        wikiUrl: "https://example.com/wiki",
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getAllByRole("img")).toHaveLength(2);
      });

      const clickHandler = mockMap.on.mock.calls.find(
        (call) => call[0] === "click",
      )?.[1];
      expect(clickHandler).toBeDefined();
      clickHandler!({ lngLat: { lng: 2.2945, lat: 48.8584 } });

      await waitFor(() => {
        expect(screen.getByText("Submit Guess")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Submit Guess"));

      await waitFor(() => {
        expect(setItemSpy).toHaveBeenCalledWith(
          "gameState",
          expect.objectContaining({
            result: {
              correctness: "CORRECT",
              actualLocation: { lng: 2.2945, lat: 48.8584 },
              distanceKm: 0.5,
              wikiSummary: "Test summary",
              wikiUrl: "https://example.com/wiki",
            },
          }),
        );
      });
    });

    it("restores complete game state including result", async () => {
      const savedState = {
        landmark: {
          id: "saved-landmark",
          name: "Saved Landmark",
          detailsUrl: "https://example.com",
          images: ["https://example.com/saved.jpg"],
        },
        guessLocation: { lng: 2.3522, lat: 48.8566 },
        result: {
          correctness: "CLOSE" as const,
          actualLocation: { lng: 2.2945, lat: 48.8584 },
          distanceKm: 200,
          wikiSummary: "Saved summary",
          wikiUrl: "https://example.com/wiki",
        },
      };

      vi.spyOn(localStorageUtils, "getItem").mockReturnValue(savedState);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText("Saved Landmark")).toBeInTheDocument();
        expect(screen.getByText("200 km away")).toBeInTheDocument();
        expect(screen.getByText("Play Again")).toBeInTheDocument();
      });
    });
  });
});
