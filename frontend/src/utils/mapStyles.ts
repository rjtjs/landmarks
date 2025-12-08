import type { PrecisionLevelType } from "@landmarks/shared";
import { PrecisionLevel } from "@landmarks/shared";

function getCSSVar(name: string, fallback: string): string {
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
}

const MARKER_COLORS = {
  [PrecisionLevel.EXACT]: "green",
  [PrecisionLevel.NARROW]: "yellow",
  [PrecisionLevel.VAGUE]: () => getCSSVar("--marker-guess", "#808080"),
  incorrect: "red",
  guess: () => getCSSVar("--marker-guess", "#808080"),
};

const CIRCLE_COLORS = {
  [PrecisionLevel.EXACT]: {
    fill: () => getCSSVar("--circle-correct", "rgba(16, 185, 129, 0.15)"),
    border: () => getCSSVar("--circle-correct-border", "#10b981"),
  },
  [PrecisionLevel.NARROW]: {
    fill: () => getCSSVar("--circle-close", "rgba(245, 158, 11, 0.1)"),
    border: () => getCSSVar("--circle-close-border", "#f59e0b"),
  },
  [PrecisionLevel.VAGUE]: {
    fill: () => getCSSVar("--circle-guess", "rgba(107, 114, 128, 0.1)"),
    border: () => getCSSVar("--circle-guess-border", "#6b7280"),
  },
  incorrect: {
    fill: () => getCSSVar("--circle-incorrect", "rgba(239, 68, 68, 0.05)"),
    border: () =>
      getCSSVar("--circle-incorrect-border", "rgba(239, 68, 68, 0.5)"),
  },
  guess: {
    fill: () => getCSSVar("--circle-guess", "rgba(107, 114, 128, 0.1)"),
    border: () => getCSSVar("--circle-guess-border", "#6b7280"),
  },
};

export function getMarkerColor(
  achievedPrecision: PrecisionLevelType | null,
  hasActualLocation: boolean = false,
): string {
  if (achievedPrecision === null) {
    const color = hasActualLocation
      ? MARKER_COLORS.incorrect
      : MARKER_COLORS.guess;
    return typeof color === "function" ? color() : color;
  }

  const color = MARKER_COLORS[achievedPrecision] || MARKER_COLORS.incorrect;
  return typeof color === "function" ? color() : color;
}

export function getGuessCircleColors(
  achievedPrecision: PrecisionLevelType | null,
  hasActualLocation: boolean = false,
): { fill: string; border: string } {
  const key =
    achievedPrecision === null
      ? hasActualLocation
        ? "incorrect"
        : "guess"
      : achievedPrecision;

  const colors = CIRCLE_COLORS[key] || CIRCLE_COLORS.guess;
  return {
    fill: colors.fill(),
    border: colors.border(),
  };
}

export function getActualLocationCircleColors(): {
  narrow: { fill: string; border: string };
  exact: { fill: string; border: string };
} {
  return {
    narrow: {
      fill: CIRCLE_COLORS[PrecisionLevel.NARROW].fill(),
      border: CIRCLE_COLORS[PrecisionLevel.NARROW].border(),
    },
    exact: {
      fill: CIRCLE_COLORS[PrecisionLevel.EXACT].fill(),
      border: CIRCLE_COLORS[PrecisionLevel.EXACT].border(),
    },
  };
}
