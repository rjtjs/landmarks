import type { Landmark } from "@landmarks/shared";

const LANDMARKS: Record<string, Landmark> = {
  eiffel: {
    id: "eiffel",
    name: "Eiffel Tower",
    location: { lng: 2.2945, lat: 48.8584 },
    detailsUrl:
      "https://en.wikipedia.org/api/rest_v1/page/summary/Eiffel_Tower",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/7/76/Georges_Garen_embrasement_tour_Eiffel.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/53/Maurice_koechlin_pylone.jpg",
    ],
  },
  taj: {
    id: "taj",
    name: "Taj Mahal",
    location: { lng: 78.0421, lat: 27.1751 },
    detailsUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/Taj_Mahal",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg",
      "https://upload.wikimedia.org/wikipedia/commons/9/94/Taj_Mahal_N-UP-A28-a_%28cropped%29.jpg",
    ],
  },
  statueOfLiberty: {
    id: "statueOfLiberty",
    name: "Statue of Liberty",
    location: { lng: -74.0445, lat: 40.6892 },
    detailsUrl:
      "https://en.wikipedia.org/api/rest_v1/page/summary/Statue_of_Liberty",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/5/57/Head_of_the_Statue_of_Liberty_on_display_in_a_park_in_Paris.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6e/EdwardMoran-UnveilingTheStatueofLiberty1886Large.jpg",
    ],
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
