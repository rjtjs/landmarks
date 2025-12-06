import type { Coordinates } from "@landmarks/shared";

export interface LandmarkProps {
  name: string;
  coordinates: Coordinates;
  wikiUrl: string;
}

export interface Landmark {
  id: string;
  props: LandmarkProps;
}
