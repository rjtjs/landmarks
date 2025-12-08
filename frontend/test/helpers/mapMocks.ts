import { vi } from "vitest";

type MapEventHandler = (event?: {
  lngLat: { lng: number; lat: number };
}) => void;

export const mockMap = {
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
  fitBounds: vi.fn(),
};

export const mockMarker = {
  setLngLat: vi.fn().mockReturnThis(),
  addTo: vi.fn().mockReturnThis(),
  remove: vi.fn(),
};

export const mockLngLatBounds = {
  extend: vi.fn().mockReturnThis(),
};

export function simulateMapClick(lng: number, lat: number) {
  const clickHandler = mockMap.on.mock.calls.find(
    (call) => call[0] === "click",
  )?.[1];

  if (!clickHandler) {
    throw new Error("Click handler not found - make sure map is initialized");
  }

  clickHandler({ lngLat: { lng, lat } });
}
