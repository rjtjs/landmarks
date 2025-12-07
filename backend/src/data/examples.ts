import type { Landmark } from "@landmarks/shared";

const LANDMARKS: Record<string, Landmark> = {
  eiffel: {
    id: "eiffel",
    name: "Eiffel Tower",
    location: { lng: 2.2945, lat: 48.8584 },
    wikiUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/Eiffel_Tower",
  },
  taj: {
    id: "taj",
    name: "Taj Mahal",
    location: { lng: 78.0421, lat: 27.1751 },
    wikiUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/Taj_Mahal",
  },
  statueOfLiberty: {
    id: "statueOfLiberty",
    name: "Statue of Liberty",
    location: { lng: -74.0445, lat: 40.6892 },
    wikiUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/Statue_of_Liberty",
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
