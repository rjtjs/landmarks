export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Guess {
  landmarkId: string;
  coordinates: Coordinates;
}

export enum CorrectnessLevel {
  CORRECT = 1,
  CLOSE = 2,
  INCORRECT = 3,
}

export interface WikiInfo {
  summary: string;
  url: string;
}

export interface GuessResponse {
  correctness: CorrectnessLevel;
  actualCoordinates: Coordinates;
  distanceKm: number;
  wikiInfo: WikiInfo;
}

export interface Landmark {
  id: string;
  name: string;
  coordinates: Coordinates;
  wikiUrl: string;
}
