export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Landmark {
  id: string;
  name: string;
  image: string;
  coords: Coordinates;
  wikiTitle: string;
}

export interface GuessRequest {
  landmarkId: string;
  guess: Coordinates;
}
