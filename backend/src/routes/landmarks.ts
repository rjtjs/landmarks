import { Request, Response, Router } from "express";
import {
  CorrectnessLevel,
  GuessSchema,
  CORRECTNESS_DISTANCES_KM,
  type GuessResult,
  type LandmarkWithoutLocation,
} from "@landmarks/shared";
import { getLandmarkById, getRandomLandmark } from "../data/examples";
import { haversineDistance } from "../utils/geographic";
import { getWikiSummary } from "../utils/landmark";

const router = Router();

router.get("/random", (_req: Request, res: Response) => {
  const landmark = getRandomLandmark();
  if (!landmark) {
    return res.status(404).json({ error: "No landmarks available" });
  }
  const { location: _, ...landmarkWithoutLocation } = landmark;
  res.json(landmarkWithoutLocation as LandmarkWithoutLocation);
});

router.post("/guess", async (req: Request, res: Response) => {
  const validation = GuessSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      error: "Invalid request body",
      details: validation.error.issues,
    });
  }

  const { landmarkId, location } = validation.data;

  const landmark = getLandmarkById(landmarkId);
  if (!landmark) {
    return res.status(400).json({ error: "Invalid landmarkId" });
  }

  const distanceKm = haversineDistance(
    landmark.location.lat,
    landmark.location.lng,
    location.lat,
    location.lng,
  );

  let correctness: CorrectnessLevel;
  if (distanceKm < CORRECTNESS_DISTANCES_KM.CORRECT) {
    correctness = CorrectnessLevel.CORRECT;
  } else if (distanceKm < CORRECTNESS_DISTANCES_KM.CLOSE) {
    correctness = CorrectnessLevel.CLOSE;
  } else {
    correctness = CorrectnessLevel.INCORRECT;
  }

  try {
    const wikiSummary = await getWikiSummary(landmark.detailsUrl);
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
