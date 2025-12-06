import { Request, Response, Router } from "express";
import type { Guess } from "@landmarks/shared";
import { getLandmarkById, getRandomLandmark } from "../data/examples";
import { GuessCorrectness, GuessResponse, WikiData } from "../types/responses";
import { haversineDistance } from "../utils/geographic";
import { getWikiSummary } from "../utils/landmark";

const router = Router();

router.get("/random", (_req: Request, res: Response) => {
  const landmark = getRandomLandmark();
  res.json(landmark);
});

router.post("/guess", async (req: Request, res: Response) => {
  const { landmarkId, coordinates } = req.body as Guess;

  const landmark = getLandmarkById(landmarkId);
  if (!landmark) {
    return res.status(400).json({ error: "Invalid landmarkId" });
  }

  const distanceKm = haversineDistance(
    landmark.props.coordinates.latitude,
    landmark.props.coordinates.longitude,
    coordinates.latitude,
    coordinates.longitude
  );

  try {
    const wikiSummary = await getWikiSummary(landmark.props.wikiUrl);
    const wikiData: WikiData = {
      extract: wikiSummary.extract,
      url: wikiSummary.content_urls?.desktop?.page || "",
    };

    const correctness = distanceKm < 50 ? GuessCorrectness.CORRECT : GuessCorrectness.INCORRECT;
    const response: GuessResponse = {
      correctness,
      correctCoordinates: {
        latitude: landmark.props.coordinates.latitude,
        longitude: landmark.props.coordinates.longitude,
      },
      distanceKm,
      wikiData,
    };
    res.json(response);
  } catch {
    res.status(500).json({ error: "Failed to fetch Wikipedia data" });
  }
});

export default router;
