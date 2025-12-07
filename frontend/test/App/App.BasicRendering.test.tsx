import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../../src/App";
import * as api from "../../src/services/api";
import { mockMap, mockMarker } from "../helpers/mapMocks";
import { EIFFEL_TOWER_WITHOUT_LOCATION } from "../fixtures/landmarks";

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

describe("App - Basic Rendering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getRandomLandmark).mockResolvedValue(
      EIFFEL_TOWER_WITHOUT_LOCATION,
    );
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
    expect(images[0]).toHaveAttribute(
      "src",
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Georges_Garen_embrasement_tour_Eiffel.jpg",
    );
    expect(images[1]).toHaveAttribute(
      "src",
      "https://upload.wikimedia.org/wikipedia/commons/5/53/Maurice_koechlin_pylone.jpg",
    );
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

  it("renders precision selector with all options", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    expect(screen.getByText("Precision:")).toBeInTheDocument();
    expect(screen.getByLabelText("5 points")).toBeInTheDocument();
    expect(screen.getByLabelText("10 points")).toBeInTheDocument();
    expect(screen.getByLabelText("25 points")).toBeInTheDocument();
  });
});
