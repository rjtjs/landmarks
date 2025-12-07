import cors from "cors";
import express from "express";
import { Server } from "http";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Guess, GuessResponse } from "@landmarks/shared";
import errorHandler from "../../src/middleware/errors";
import router from "../../src/routes/index";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

describe("Landmark routes", () => {
  let server: Server;

  beforeAll(() => {
    server = app.listen(0); // random available port
  });

  afterAll(() => {
    return new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it("GET /api/landmarks/random returns a landmark", async () => {
    const res = await request(app).get("/api/landmarks/random");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  it("POST /api/landmarks/guess returns distance and wiki info", async () => {
    const guessPayload: Guess = {
      landmarkId: "eiffel",
      coordinates: { latitude: 48.8584, longitude: 2.2945 },
    };

    const res = await request(server).post("/api/landmarks/guess").send(guessPayload);
    expect(res.status).toBe(200);

    const body = res.body as GuessResponse;
    expect(body).toHaveProperty("correctness");
    expect(body).toHaveProperty("distanceKm");
    expect(body).toHaveProperty("actualCoordinates");
    expect(body).toHaveProperty("wikiInfo");
  });

  it("POST /api/landmarks/guess with invalid id returns 400", async () => {
    const res = await request(server)
      .post("/api/landmarks/guess")
      .send({ landmarkId: "invalid", guess: { lat: 0, lng: 0 } });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
