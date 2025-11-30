import { Landmark } from "../types/geographic";

const LANDMARKS: Record<string, Landmark> = {
  eiffel: {
    id: "eiffel",
    props: {
      name: "Eiffel Tower",
      coordinates: { latitude: 48.8584, longitude: 2.2945 },
      wikiUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/Eiffel_Tower",
    },
  },
  taj: {
    id: "taj",
    props: {
      name: "Taj Mahal",
      coordinates: { latitude: 27.1751, longitude: 78.0421 },
      wikiUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/Taj_Mahal",
    },
  },
  statueOfLiberty: {
    id: "statueOfLiberty",
    props: {
      name: "Statue of Liberty",
      coordinates: { latitude: 40.6892, longitude: -74.0445 },
      wikiUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/Statue_of_Liberty",
    },
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
