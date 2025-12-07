function getCSSVariable(name: string, fallback: string): string {
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
}

export function getMarkerColor(
  hasActualLocation: boolean,
  correctnessColor?: string,
): string {
  if (hasActualLocation && correctnessColor) {
    return correctnessColor;
  }
  return getCSSVariable("--marker-guess", "#808080");
}

export function getGuessCircleColors(
  hasActualLocation: boolean,
  markerColor: string,
): { fill: string; border: string } {
  if (!hasActualLocation) {
    return {
      fill: getCSSVariable("--circle-guess", "rgba(107, 114, 128, 0.1)"),
      border: getCSSVariable("--circle-guess-border", "#6b7280"),
    };
  }

  if (markerColor === "green") {
    return {
      fill: getCSSVariable("--circle-correct", "rgba(16, 185, 129, 0.15)"),
      border: getCSSVariable("--circle-correct-border", "#10b981"),
    };
  }

  if (markerColor === "yellow") {
    return {
      fill: getCSSVariable("--circle-close", "rgba(245, 158, 11, 0.1)"),
      border: getCSSVariable("--circle-close-border", "#f59e0b"),
    };
  }

  return {
    fill: getCSSVariable("--circle-incorrect", "rgba(239, 68, 68, 0.05)"),
    border: getCSSVariable(
      "--circle-incorrect-border",
      "rgba(239, 68, 68, 0.5)",
    ),
  };
}

export function getActualLocationCircleColors(): {
  close: { fill: string; border: string };
  correct: { fill: string; border: string };
} {
  return {
    close: {
      fill: getCSSVariable("--circle-close", "rgba(245, 158, 11, 0.1)"),
      border: getCSSVariable("--circle-close-border", "#f59e0b"),
    },
    correct: {
      fill: getCSSVariable("--circle-correct", "rgba(16, 185, 129, 0.15)"),
      border: getCSSVariable("--circle-correct-border", "#10b981"),
    },
  };
}
