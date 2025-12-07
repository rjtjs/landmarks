import type {
  LandmarkWithoutLocation,
  GuessResult,
  LngLat,
  PrecisionLevelType,
} from "@landmarks/shared";

type StorageKey = "theme" | "gameState";

interface GameState {
  landmark: LandmarkWithoutLocation | null;
  guessLocation: LngLat | null;
  result: GuessResult | null;
  availablePrecisions: PrecisionLevelType[];
  selectedPrecision: PrecisionLevelType;
}

type StorageValue<K extends StorageKey> = K extends "theme"
  ? "light" | "dark"
  : K extends "gameState"
    ? GameState
    : never;

export function getItem<K extends StorageKey>(key: K): StorageValue<K> | null {
  const item = localStorage.getItem(key);
  if (!item) return null;

  try {
    return JSON.parse(item);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function setItem<K extends StorageKey>(
  key: K,
  value: StorageValue<K>,
): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: StorageKey): void {
  localStorage.removeItem(key);
}
