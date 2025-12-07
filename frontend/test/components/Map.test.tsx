import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrecisionLevel } from "@landmarks/shared";
import Map from "../../src/components/Map";

type MapEventHandler = (event?: {
  lngLat: { lng: number; lat: number };
}) => void;

const mockMap = {
  on: vi.fn((event: string, handler: MapEventHandler) => {
    if (event === "load") {
      handler();
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
        selectedPrecision={PrecisionLevel.VAGUE}
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
        selectedPrecision={PrecisionLevel.VAGUE}
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
        selectedPrecision={PrecisionLevel.VAGUE}
        disabled={false}
      />,
    );

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

    clickHandler!(mockEvent);

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
        selectedPrecision={PrecisionLevel.VAGUE}
        disabled={true}
      />,
    );

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
    });

    const clickHandler = mockMap.on.mock.calls.find(
      (call) => call[0] === "click",
    )?.[1];

    expect(clickHandler).toBeDefined();

    clickHandler!({ lngLat: { lng: 0, lat: 0 } });

    expect(mockOnLocationSelect).not.toHaveBeenCalled();
  });

  it("creates guess marker when guessLocation is provided", async () => {
    const mapboxgl = await import("mapbox-gl");

    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={{ lng: 2.2945, lat: 48.8584 }}
        selectedPrecision={PrecisionLevel.VAGUE}
        disabled={false}
      />,
    );

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("load", expect.any(Function));
    });

    await waitFor(
      () => {
        expect(mapboxgl.default.Marker).toHaveBeenCalledWith({
          color: "#808080",
        });
        expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
      },
      { timeout: 2000 },
    );
  });

  it("creates actual location marker when actualLocation is provided", async () => {
    const mapboxgl = await import("mapbox-gl");

    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={{ lng: 2.2945, lat: 48.8584 }}
        selectedPrecision={PrecisionLevel.EXACT}
        actualLocation={{ lng: 2.3, lat: 48.9 }}
        achievedPrecision={PrecisionLevel.EXACT}
        disabled={true}
      />,
    );

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("load", expect.any(Function));
    });

    await waitFor(
      () => {
        expect(mapboxgl.default.Marker).toHaveBeenCalledWith({
          color: "green",
        });
      },
      { timeout: 2000 },
    );
  });

  it("uses achievedPrecision color for guess marker", async () => {
    const mapboxgl = await import("mapbox-gl");

    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={{ lng: 2.2945, lat: 48.8584 }}
        selectedPrecision={PrecisionLevel.NARROW}
        actualLocation={{ lng: 2.3, lat: 48.9 }}
        achievedPrecision={PrecisionLevel.NARROW}
        disabled={false}
      />,
    );

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("load", expect.any(Function));
    });

    await waitFor(
      () => {
        expect(mapboxgl.default.Marker).toHaveBeenCalledWith({
          color: "yellow",
        });
      },
      { timeout: 2000 },
    );
  });

  it("cleans up map on unmount", async () => {
    const { unmount } = render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={null}
        selectedPrecision={PrecisionLevel.VAGUE}
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
