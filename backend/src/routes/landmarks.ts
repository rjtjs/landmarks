import axios from "axios";
import { Request, Response, Router } from "express";
import { getLandmarkById, getRandomLandmark } from "../data/examples";
import { GuessRequest } from "../types";
import { haversineDistance } from "../utils";

const router = Router();

router.get("/random", (_req: Request, res: Response) => {
  const landmark = getRandomLandmark();
  res.json(landmark);
});

router.post("/guess", async (req: Request, res: Response) => {
  const { landmarkId, guess } = req.body as GuessRequest;

  const landmark = getLandmarkById(landmarkId);
  if (!landmark) {
    return res.status(400).json({ error: "Invalid landmarkId" });
  }

  const distanceKm = haversineDistance(
    landmark.coords.lat,
    landmark.coords.lng,
    guess.lat,
    guess.lng
  );

  const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${landmark.wikiTitle}`;

  try {
    const wikiResponse = await axios.get(wikiUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "LandmarkQuizApp/1.0",
      },
    });
    const wikiData = wikiResponse.data;

    res.json({
      correct: landmark.coords,
      distanceKm,
      wiki: {
        extract: wikiData.extract,
        url: wikiData.content_urls.desktop.page,
      },
    });
  } catch (err: any) {
    console.error("Wikipedia API error:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Headers:", err.response.headers);
      console.error("Data:", err.response.data);
    }
    res.status(500).json({ error: "Failed to fetch Wikipedia data" });
  }
});

export default router;
