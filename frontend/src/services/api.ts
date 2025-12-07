import axios from "axios";
import type {
  LandmarkWithoutLocation,
  Guess,
  GuessResult,
} from "@landmarks/shared";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getRandomLandmark(): Promise<LandmarkWithoutLocation> {
  const response = await axios.get<LandmarkWithoutLocation>(
    `${API_BASE_URL}/api/landmarks/random`,
  );
  return response.data;
}

export async function submitGuess(guess: Guess): Promise<GuessResult> {
  const response = await axios.post<GuessResult>(
    `${API_BASE_URL}/api/landmarks/guess`,
    guess,
  );
  return response.data;
}
