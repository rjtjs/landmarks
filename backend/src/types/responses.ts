import { Coordinates } from "./geographic";

export enum GuessCorrectness {
  INCORRECT = "incorrect",
  CORRECT = "correct",
}

export interface WikiData {
  extract: string;
  url: string;
}

export interface GuessResponse {
  correctness: GuessCorrectness;
  correctCoordinates: Coordinates;
  distanceKm: number;
  wikiData: WikiData;
}
