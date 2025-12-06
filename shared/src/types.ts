export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Guess {
  coordinates: Coordinates;
  landmarkId: string;
}

export interface GuessResponse {
  correct: boolean;
  distance?: number;
  actualLocation?: Coordinates;
  score?: number;
  message?: string;
}

export interface Landmark {
  id: string;
  name: string;
  coordinates: Coordinates;
  description?: string;
  imageUrl?: string;
}
