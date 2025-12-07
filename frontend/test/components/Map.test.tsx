import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Map from "../../src/components/Map";

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

describe("Map", () => {
  const mockOnLocationSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes mapbox map on mount", async () => {
    const mapboxgl = await import("mapbox-gl");

    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={null}
        disabled={false}
      />,
    );

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
    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={null}
        disabled={false}
      />,
    );

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
    });
  });

  it("calls onLocationSelect when map is clicked", async () => {
    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={null}
        disabled={false}
      />,
    );

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
    });

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === "click",
    )?.[1];

    const mockEvent = {
      lngLat: { lng: 2.2945, lat: 48.8584 },
    };

    clickHandler(mockEvent);

    expect(mockOnLocationSelect).toHaveBeenCalledWith({
      lng: 2.2945,
      lat: 48.8584,
    });
  });

  it("does not call onLocationSelect when disabled", async () => {
    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={null}
        disabled={true}
      />,
    );

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
    });

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === "click",
    )?.[1];

    clickHandler({ lngLat: { lng: 0, lat: 0 } });

    expect(mockOnLocationSelect).not.toHaveBeenCalled();
  });

  it("creates guess marker when guessLocation is provided", async () => {
    const mapboxgl = await import("mapbox-gl");

    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={{ lng: 2.2945, lat: 48.8584 }}
        disabled={false}
      />,
    );

    await waitFor(() => {
      expect(mapboxgl.default.Marker).toHaveBeenCalledWith({ color: "red" });
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });
  });

  it("creates actual location marker when actualLocation is provided", async () => {
    const mapboxgl = await import("mapbox-gl");

    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={{ lng: 2.2945, lat: 48.8584 }}
        actualLocation={{ lng: 2.3, lat: 48.9 }}
        disabled={true}
      />,
    );

    await waitFor(() => {
      expect(mapboxgl.default.Marker).toHaveBeenCalledWith({ color: "green" });
    });
  });

  it("uses correctnessColor for guess marker", async () => {
    const mapboxgl = await import("mapbox-gl");

    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={{ lng: 2.2945, lat: 48.8584 }}
        correctnessColor="yellow"
        disabled={false}
      />,
    );

    await waitFor(() => {
      expect(mapboxgl.default.Marker).toHaveBeenCalledWith({ color: "yellow" });
    });
  });

  it("cleans up map on unmount", async () => {
    const { unmount } = render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={null}
        disabled={false}
      />,
    );

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalled();
    });

    unmount();

    expect(mockMap.remove).toHaveBeenCalled();
  });
});
