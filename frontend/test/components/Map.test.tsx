import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrecisionLevel, MAP_CONFIG } from "@landmarks/shared";
import Map from "../../src/components/Map";
import { mockMap, mockMarker, mockLngLatBounds } from "../helpers/mapMocks";

vi.mock("mapbox-gl", () => ({
  default: {
    accessToken: "",
    Map: vi.fn(function Map() {
      return mockMap;
    }),
    Marker: vi.fn(function Marker() {
      return mockMarker;
    }),
    LngLatBounds: vi.fn(function LngLatBounds() {
      return mockLngLatBounds;
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
    const MockedMarker = vi.mocked(mapboxgl.default.Marker);

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

    await waitFor(
      () => {
        expect(MockedMarker.mock.calls.length).toBeGreaterThanOrEqual(2);
        expect(
          MockedMarker.mock.calls.some((call) => call[0]?.color === "green"),
        ).toBe(true);
      },
      { timeout: 2000 },
    );
  });

  it("uses achievedPrecision color for guess marker", async () => {
    const mapboxgl = await import("mapbox-gl");
    const MockedMarker = vi.mocked(mapboxgl.default.Marker);

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

    await waitFor(
      () => {
        expect(
          MockedMarker.mock.calls.some((call) => call[0]?.color === "yellow"),
        ).toBe(true);
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

  it("fits bounds to show both guess and actual location when result is shown", async () => {
    const guessLocation = { lng: 2.2945, lat: 48.8584 };
    const actualLocation = { lng: 2.3, lat: 48.9 };

    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={guessLocation}
        selectedPrecision={PrecisionLevel.VAGUE}
        actualLocation={actualLocation}
        achievedPrecision={PrecisionLevel.VAGUE}
        disabled={true}
      />,
    );

    await waitFor(
      () => {
        expect(mockMap.fitBounds).toHaveBeenCalled();
        const fitBoundsCall = mockMap.fitBounds.mock.calls[0];
        expect(fitBoundsCall[1]).toEqual({
          padding: MAP_CONFIG.resultBoundsPadding,
          maxZoom: MAP_CONFIG.maxZoomOnResult,
        });
      },
      { timeout: 2000 },
    );
  });

  it("uses correct config values for fitBounds", async () => {
    const guessLocation = { lng: 0, lat: 0 };
    const actualLocation = { lng: 10, lat: 10 };

    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={guessLocation}
        selectedPrecision={PrecisionLevel.EXACT}
        actualLocation={actualLocation}
        achievedPrecision={PrecisionLevel.EXACT}
        disabled={true}
      />,
    );

    await waitFor(
      () => {
        expect(mockMap.fitBounds).toHaveBeenCalled();
        const fitBoundsCall = mockMap.fitBounds.mock.calls[0];
        expect(fitBoundsCall[1]).toEqual({
          padding: 100,
          maxZoom: 10,
        });
      },
      { timeout: 2000 },
    );
  });

  it("does not call fitBounds when only guess location is shown", async () => {
    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={{ lng: 2.2945, lat: 48.8584 }}
        selectedPrecision={PrecisionLevel.VAGUE}
        disabled={false}
      />,
    );

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockMap.fitBounds).not.toHaveBeenCalled();
  });

  it("registers load event handler on map initialization", async () => {
    render(
      <Map
        onLocationSelect={mockOnLocationSelect}
        guessLocation={null}
        selectedPrecision={PrecisionLevel.VAGUE}
        disabled={false}
      />,
    );

    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledWith("load", expect.any(Function));
    });
  });
});
