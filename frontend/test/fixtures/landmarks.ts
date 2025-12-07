import type { LandmarkWithoutLocation, GuessResult } from "@landmarks/shared";
import { PrecisionLevel } from "@landmarks/shared";

export const EIFFEL_TOWER_WITHOUT_LOCATION: LandmarkWithoutLocation = {
  id: "eiffel",
  name: "Eiffel Tower",
  detailsUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/Eiffel_Tower",
  images: [
    "https://upload.wikimedia.org/wikipedia/commons/7/76/Georges_Garen_embrasement_tour_Eiffel.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/53/Maurice_koechlin_pylone.jpg",
  ],
};

export const TAJ_MAHAL_WITHOUT_LOCATION: LandmarkWithoutLocation = {
  id: "taj",
  name: "Taj Mahal",
  detailsUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/Taj_Mahal",
  images: [
    "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg",
    "https://upload.wikimedia.org/wikipedia/commons/9/94/Taj_Mahal_N-UP-A28-a_%28cropped%29.jpg",
  ],
};

export const EIFFEL_LOCATION = { lng: 2.2945, lat: 48.8584 };
export const NEARBY_EIFFEL_LOCATION = { lng: 2.35, lat: 48.86 };
export const FAR_FROM_EIFFEL_LOCATION = { lng: -74.0445, lat: 40.6892 };

export function createGuessResult(
  overrides: Partial<GuessResult> = {},
): GuessResult {
  return {
    isCorrect: true,
    achievedPrecision: PrecisionLevel.EXACT,
    actualLocation: EIFFEL_LOCATION,
    distanceKm: 0.5,
    wikiSummary:
      "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France.",
    wikiUrl: "https://en.wikipedia.org/wiki/Eiffel_Tower",
    ...overrides,
  };
}

export const EXACT_CORRECT_RESULT = createGuessResult({
  isCorrect: true,
  achievedPrecision: PrecisionLevel.EXACT,
  distanceKm: 0.5,
});

export const NARROW_CORRECT_RESULT = createGuessResult({
  isCorrect: true,
  achievedPrecision: PrecisionLevel.NARROW,
  distanceKm: 75,
});

export const VAGUE_CORRECT_RESULT = createGuessResult({
  isCorrect: true,
  achievedPrecision: PrecisionLevel.VAGUE,
  distanceKm: 200,
});

export const INCORRECT_RESULT = createGuessResult({
  isCorrect: false,
  achievedPrecision: null,
  distanceKm: 1500,
});
