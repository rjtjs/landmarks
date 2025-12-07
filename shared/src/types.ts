export interface LngLat {
  lng: number;
  lat: number;
}

export interface Guess {
  landmarkId: string;
  location: LngLat;
}

export enum CorrectnessLevel {
  CORRECT = 1,
  CLOSE = 2,
  INCORRECT = 3,
}

export interface GuessResult {
  correctness: CorrectnessLevel;
  actualLocation: LngLat;
  distanceKm: number;
  wikiSummary: string;
  wikiUrl: string;
}

export interface Landmark {
  id: string;
  name: string;
  location: LngLat;
  detailsUrl: string;
  images: string[];
}

export type LandmarkWithoutLocation = Omit<Landmark, "location">;
