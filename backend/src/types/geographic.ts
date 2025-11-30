export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LandmarkProps {
  name: string;
  coordinates: Coordinates;
  wikiUrl: string;
}

export interface Landmark {
  id: string;
  props: LandmarkProps;
}
