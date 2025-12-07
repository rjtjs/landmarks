import type { PrecisionLevelType } from "@landmarks/shared";
import { PrecisionLevel } from "@landmarks/shared";

function getCSSVariable(name: string, fallback: string): string {
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
}

export function getMarkerColor(
  achievedPrecision: PrecisionLevelType | null,
  hasActualLocation: boolean = false,
): string {
  if (achievedPrecision === null) {
    return hasActualLocation
      ? "red"
      : getCSSVariable("--marker-guess", "#808080");
  }

  switch (achievedPrecision) {
    case PrecisionLevel.EXACT:
      return "green";
    case PrecisionLevel.NARROW:
      return "yellow";
    case PrecisionLevel.VAGUE:
      return getCSSVariable("--marker-guess", "#808080");
    default:
      return "red";
  }
}

export function getGuessCircleColors(
  achievedPrecision: PrecisionLevelType | null,
  hasActualLocation: boolean = false,
): { fill: string; border: string } {
  if (achievedPrecision === null) {
    if (hasActualLocation) {
      return {
        fill: getCSSVariable("--circle-incorrect", "rgba(239, 68, 68, 0.05)"),
        border: getCSSVariable(
          "--circle-incorrect-border",
          "rgba(239, 68, 68, 0.5)",
        ),
      };
    }
    return {
      fill: getCSSVariable("--circle-guess", "rgba(107, 114, 128, 0.1)"),
      border: getCSSVariable("--circle-guess-border", "#6b7280"),
    };
  }

  switch (achievedPrecision) {
    case PrecisionLevel.EXACT:
      return {
        fill: getCSSVariable("--circle-correct", "rgba(16, 185, 129, 0.15)"),
        border: getCSSVariable("--circle-correct-border", "#10b981"),
      };
    case PrecisionLevel.NARROW:
      return {
        fill: getCSSVariable("--circle-close", "rgba(245, 158, 11, 0.1)"),
        border: getCSSVariable("--circle-close-border", "#f59e0b"),
      };
    case PrecisionLevel.VAGUE:
      return {
        fill: getCSSVariable("--circle-guess", "rgba(107, 114, 128, 0.1)"),
        border: getCSSVariable("--circle-guess-border", "#6b7280"),
      };
    default:
      return {
        fill: getCSSVariable("--circle-guess", "rgba(107, 114, 128, 0.1)"),
        border: getCSSVariable("--circle-guess-border", "#6b7280"),
      };
  }
}

export function getActualLocationCircleColors(): {
  narrow: { fill: string; border: string };
  exact: { fill: string; border: string };
} {
  return {
    narrow: {
      fill: getCSSVariable("--circle-close", "rgba(245, 158, 11, 0.1)"),
      border: getCSSVariable("--circle-close-border", "#f59e0b"),
    },
    exact: {
      fill: getCSSVariable("--circle-correct", "rgba(16, 185, 129, 0.15)"),
      border: getCSSVariable("--circle-correct-border", "#10b981"),
    },
  };
}
