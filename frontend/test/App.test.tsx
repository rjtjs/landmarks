import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import App from "../src/App";
import * as api from "../src/services/api";

const mockMap = {
  on: vi.fn(),
  off: vi.fn(),
  remove: vi.fn(),
  getCanvas: vi.fn(() => document.createElement("canvas")),
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

  it("renders the app with heading", async () => {
    render(<App />);
    expect(screen.getByText("Landmarks Guessing Game")).toBeInTheDocument();
  });

  it("loads and displays landmark images", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Where is this landmark?")).toBeInTheDocument();
    });

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
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
      expect(screen.getByText("Where is this landmark?")).toBeInTheDocument();
    });

    expect(screen.queryByText("Submit Guess")).not.toBeInTheDocument();
  });

  it("submits guess and displays result", async () => {
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
      expect(screen.getByText("Where is this landmark?")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
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
      expect(screen.getByText("Result")).toBeInTheDocument();
      expect(screen.getByText("Correct!")).toBeInTheDocument();
      expect(screen.getByText(/0.50 km/)).toBeInTheDocument();
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
      expect(screen.getByText("Where is this landmark?")).toBeInTheDocument();
    });

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === "click",
    )?.[1];
    clickHandler({ lngLat: { lng: 0, lat: 0 } });

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
});
