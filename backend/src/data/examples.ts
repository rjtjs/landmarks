import type { Landmark } from "@landmarks/shared";

const LANDMARKS: Record<string, Landmark> = {
  eiffel: {
    id: "eiffel",
    name: "Eiffel Tower",
    location: { lng: 2.2945, lat: 48.8584 },
    detailsUrl:
      "https://en.wikipedia.org/api/rest_v1/page/summary/Eiffel_Tower",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Eiffeltoren_Parijs.jpg/800px-Eiffeltoren_Parijs.jpg",
    ],
  },
  taj: {
    id: "taj",
    name: "Taj Mahal",
    location: { lng: 78.0421, lat: 27.1751 },
    detailsUrl: "https://en.wikipedia.org/api/rest_v1/page/summary/Taj_Mahal",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/800px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg",
    ],
  },
  statueOfLiberty: {
    id: "statueOfLiberty",
    name: "Statue of Liberty",
    location: { lng: -74.0445, lat: 40.6892 },
    detailsUrl:
      "https://en.wikipedia.org/api/rest_v1/page/summary/Statue_of_Liberty",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/800px-Statue_of_Liberty_7.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Lady_Liberty_under_a_blue_sky_%28cropped%29.jpg/800px-Lady_Liberty_under_a_blue_sky_%28cropped%29.jpg",
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
