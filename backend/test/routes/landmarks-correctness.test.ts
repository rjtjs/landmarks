import cors from "cors";
import express from "express";
import { Server } from "http";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CorrectnessLevel, type Guess, type GuessResult } from "@landmarks/shared";
import errorHandler from "../../src/middleware/errors";
import router from "../../src/routes/index";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

describe("Landmark correctness levels", () => {
  let server: Server;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(() => {
    return new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it("returns CORRECT for distance < 50km", async () => {
    const nearbyLocation = { lng: 2.35, lat: 48.86 };

    const guessPayload: Guess = {
      landmarkId: "eiffel",
      location: nearbyLocation,
    };

    const res = await request(server).post("/api/landmarks/guess").send(guessPayload);
    expect(res.status).toBe(200);

    const body = res.body as GuessResult;
    expect(body.correctness).toBe(CorrectnessLevel.CORRECT);
    expect(body.distanceKm).toBeLessThan(50);
  });

  it("returns CLOSE for distance between 50km and 500km", async () => {
    const closeLocation = { lng: 2.5, lat: 50.0 };

    const guessPayload: Guess = {
      landmarkId: "eiffel",
      location: closeLocation,
    };

    const res = await request(server).post("/api/landmarks/guess").send(guessPayload);
    expect(res.status).toBe(200);

    const body = res.body as GuessResult;
    expect(body.correctness).toBe(CorrectnessLevel.CLOSE);
    expect(body.distanceKm).toBeGreaterThanOrEqual(50);
    expect(body.distanceKm).toBeLessThan(500);
  });

  it("returns INCORRECT for distance >= 500km", async () => {
    const farLocation = { lng: -74.0445, lat: 40.6892 };

    const guessPayload: Guess = {
      landmarkId: "eiffel",
      location: farLocation,
    };

    const res = await request(server).post("/api/landmarks/guess").send(guessPayload);
    expect(res.status).toBe(200);

    const body = res.body as GuessResult;
    expect(body.correctness).toBe(CorrectnessLevel.INCORRECT);
    expect(body.distanceKm).toBeGreaterThanOrEqual(500);
  });

  it("returns exact location match with zero distance", async () => {
    const eiffelLocation = { lng: 2.2945, lat: 48.8584 };

    const guessPayload: Guess = {
      landmarkId: "eiffel",
      location: eiffelLocation,
    };

    const res = await request(server).post("/api/landmarks/guess").send(guessPayload);
    expect(res.status).toBe(200);

    const body = res.body as GuessResult;
    expect(body.correctness).toBe(CorrectnessLevel.CORRECT);
    expect(body.distanceKm).toBeCloseTo(0, 1);
  });
});
