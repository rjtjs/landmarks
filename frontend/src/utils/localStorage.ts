import type {
  LandmarkWithoutLocation,
  GuessResult,
  LngLat,
  PrecisionLevelType,
} from "@landmarks/shared";

export interface GameState {
  landmark: LandmarkWithoutLocation | null;
  guessLocation: LngLat | null;
  result: GuessResult | null;
  selectedPrecision: PrecisionLevelType;
}

export type Theme = "light" | "dark";

export function getGameState(): GameState | null {
  const item = localStorage.getItem("gameState");
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    localStorage.removeItem("gameState");
    return null;
  }
}

export function setGameState(state: GameState): void {
  localStorage.setItem("gameState", JSON.stringify(state));
}

export function removeGameState(): void {
  localStorage.removeItem("gameState");
}

export function getTheme(): Theme | null {
  const item = localStorage.getItem("theme");
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    localStorage.removeItem("theme");
    return null;
  }
}

export function setTheme(theme: Theme): void {
  localStorage.setItem("theme", JSON.stringify(theme));
}

export function removeTheme(): void {
  localStorage.removeItem("theme");
}
