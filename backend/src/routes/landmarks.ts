import { Request, Response, Router } from "express";
import { CorrectnessLevel, type Guess, type GuessResult } from "@landmarks/shared";
import { getLandmarkById, getRandomLandmark } from "../data/examples";
import { haversineDistance } from "../utils/geographic";
import { getWikiSummary } from "../utils/landmark";

const router = Router();

router.get("/random", (_req: Request, res: Response) => {
  const landmark = getRandomLandmark();
  res.json(landmark);
});

router.post("/guess", async (req: Request, res: Response) => {
  const { landmarkId, location } = req.body as Guess;

  const landmark = getLandmarkById(landmarkId);
  if (!landmark) {
    return res.status(400).json({ error: "Invalid landmarkId" });
  }

  const distanceKm = haversineDistance(
    landmark.location.lat,
    landmark.location.lng,
    location.lat,
    location.lng
  );

  let correctness: CorrectnessLevel;
  if (distanceKm < 50) {
    correctness = CorrectnessLevel.CORRECT;
  } else if (distanceKm < 500) {
    correctness = CorrectnessLevel.CLOSE;
  } else {
    correctness = CorrectnessLevel.INCORRECT;
  }

  try {
    const wikiSummary = await getWikiSummary(landmark.wikiUrl);
    const response: GuessResult = {
      correctness,
      actualLocation: landmark.location,
      distanceKm,
      wikiSummary: wikiSummary.extract,
      wikiUrl: wikiSummary.content_urls?.desktop?.page || "",
    };
    res.json(response);
  } catch {
    res.status(500).json({ error: "Failed to fetch Wikipedia data" });
  }
});

export default router;
