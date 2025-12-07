import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../src/App";

const mockMap = {
  on: vi.fn(),
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

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the app with heading", () => {
    render(<App />);
    expect(
      screen.getByText("Click on the map to place a marker"),
    ).toBeInTheDocument();
  });

  it("renders map container", () => {
    const { container } = render(<App />);
    const mapContainer = container.querySelector('[style*="height: 400px"]');
    expect(mapContainer).toBeInTheDocument();
  });

  it("initializes mapbox map on mount", async () => {
    const mapboxgl = await import("mapbox-gl");
    render(<App />);

    await waitFor(() => {
      expect(mapboxgl.default.Map).toHaveBeenCalledWith(
        expect.objectContaining({
          style: "mapbox://styles/mapbox/streets-v12",
          center: [0, 20],
          zoom: 1.5,
        }),
      );
    });
  });

  it("registers click event handler on map", async () => {
    render(<App />);

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
    });
  });

  it("creates marker when map is clicked", async () => {
    const mapboxgl = await import("mapbox-gl");
    render(<App />);

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
    });

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === "click",
    )?.[1];
    expect(clickHandler).toBeDefined();

    const mockEvent = {
      lngLat: { lng: 2.2945, lat: 48.8584 },
    };

    clickHandler(mockEvent);

    await waitFor(() => {
      expect(mapboxgl.default.Marker).toHaveBeenCalledWith({ color: "red" });
      expect(mockMarker.setLngLat).toHaveBeenCalledWith(mockEvent.lngLat);
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });
  });

  it("updates existing marker position on subsequent clicks", async () => {
    render(<App />);

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
    });

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === "click",
    )?.[1];

    const firstClick = { lngLat: { lng: 2.2945, lat: 48.8584 } };
    clickHandler(firstClick);

    await waitFor(() => {
      expect(mockMarker.setLngLat).toHaveBeenCalledWith(firstClick.lngLat);
    });

    vi.clearAllMocks();

    const secondClick = { lngLat: { lng: -0.1278, lat: 51.5074 } };
    clickHandler(secondClick);

    await waitFor(() => {
      expect(mockMarker.setLngLat).toHaveBeenCalledWith(secondClick.lngLat);
    });
  });
});
