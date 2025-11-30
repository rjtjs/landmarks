import { Landmark } from "../types";

const LANDMARKS: Record<string, Landmark> = {
  eiffel: {
    id: "eiffel",
    name: "Eiffel Tower",
    image: "/images/eiffel.jpg",
    coords: { lat: 48.8584, lng: 2.2945 },
    wikiTitle: "Eiffel_Tower",
  },
  taj: {
    id: "taj",
    name: "Taj Mahal",
    image: "/images/taj.jpg",
    coords: { lat: 27.1751, lng: 78.0421 },
    wikiTitle: "Taj_Mahal",
  },
  statueOfLiberty: {
    id: "statueOfLiberty",
    name: "Statue of Liberty",
    image: "/images/statue_of_liberty.jpg",
    coords: { lat: 40.6892, lng: -74.0445 },
    wikiTitle: "Statue_of_Liberty",
  },
};

export function getRandomLandmark(): Landmark | undefined {
  const landmarks = Object.values(LANDMARKS);
  const randomIndex = Math.floor(Math.random() * landmarks.length);
  return landmarks[randomIndex];
}

export function getLandmarkById(id: string): Landmark | undefined {
  return LANDMARKS[id];
}
