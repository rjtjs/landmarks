import { Coordinates } from "./geographic";

export interface GuessRequest {
  landmarkId: string;
  coordinates: Coordinates;
}
