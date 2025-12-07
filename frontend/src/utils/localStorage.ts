import type {
  LandmarkWithoutLocation,
  GuessResult,
  LngLat,
} from "@landmarks/shared";

type StorageKey = "theme" | "gameState";

interface GameState {
  landmark: LandmarkWithoutLocation | null;
  guessLocation: LngLat | null;
  result: GuessResult | null;
}

type StorageValue<K extends StorageKey> = K extends "theme"
  ? "light" | "dark"
  : K extends "gameState"
    ? GameState
    : never;

export function getItem<K extends StorageKey>(key: K): StorageValue<K> | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item);
  } catch {
    return null;
  }
}

export function setItem<K extends StorageKey>(
  key: K,
  value: StorageValue<K>,
): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage`, error);
  }
}

export function removeItem(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove ${key} from localStorage`, error);
  }
}
