import cors from "cors";
import express from "express";
import { Server } from "http";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  PrecisionLevel,
  PRECISION_RADII_KM,
  type Guess,
  type GuessResult,
} from "@landmarks/shared";
import errorHandler from "../../src/middleware/errors";
import router from "../../src/routes/index";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

describe("Landmark precision levels", () => {
  let server: Server;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(() => {
    return new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it(`returns correct at EXACT precision for distance < ${PRECISION_RADII_KM.EXACT}km`, async () => {
    const nearbyLocation = { lng: 2.35, lat: 48.86 };

    const guessPayload: Guess = {
      landmarkId: "eiffel",
      location: nearbyLocation,
      precision: PrecisionLevel.EXACT,
    };

    const res = await request(server)
      .post("/api/landmarks/guess")
      .send(guessPayload);
    expect(res.status).toBe(200);

    const body = res.body as GuessResult;
    expect(body.isCorrect).toBe(true);
    expect(body.achievedPrecision).toBe(PrecisionLevel.EXACT);
    expect(body.distanceKm).toBeLessThan(PRECISION_RADII_KM.EXACT);
    expect(body.availablePrecisions).toEqual([]);
  });

  it(`returns correct at NARROW precision for distance between ${PRECISION_RADII_KM.EXACT}km and ${PRECISION_RADII_KM.NARROW}km`, async () => {
    const closeLocation = { lng: 2.99, lat: 4949.44 };

    const guessPayload: Guess = {
      landmarkId: "eiffel",
      location: closeLocation,
      precision: PrecisionLevel.NARROW,
    };

    const res = await request(server)
      .post("/api/landmarks/guess")
      .send(guessPayload);
    expect(res.status).toBe(200);

    const body = res.body as GuessResult;
    expect(body.isCorrect).toBe(true);
    expect(body.achievedPrecision).toBe(PrecisionLevel.NARROW);
    expect(body.distanceKm).toBeGreaterThanOrEqual(PRECISION_RADII_KM.EXACT);
    expect(body.distanceKm).toBeLessThan(PRECISION_RADII_KM.NARROW);
    expect(body.availablePrecisions).toEqual([PrecisionLevel.EXACT]);
  });

  it(`returns correct at VAGUE precision for distance between ${PRECISION_RADII_KM.NARROW}km and ${PRECISION_RADII_KM.VAGUE}km`, async () => {
    const vagueLocation = { lng: 4.0, lat: 50.5 };

    const guessPayload: Guess = {
      landmarkId: "eiffel",
      location: vagueLocation,
      precision: PrecisionLevel.VAGUE,
    };

    const res = await request(server)
      .post("/api/landmarks/guess")
      .send(guessPayload);
    expect(res.status).toBe(200);

    const body = res.body as GuessResult;
    expect(body.isCorrect).toBe(true);
    expect(body.achievedPrecision).toBe(PrecisionLevel.VAGUE);
    expect(body.distanceKm).toBeGreaterThanOrEqual(PRECISION_RADII_KM.NARROW);
    expect(body.distanceKm).toBeLessThan(PRECISION_RADII_KM.VAGUE);
    expect(body.availablePrecisions).toEqual([
      PrecisionLevel.NARROW,
      PrecisionLevel.EXACT,
    ]);
  });

  it(`returns incorrect for distance >= ${PRECISION_RADII_KM.VAGUE}km at any precision`, async () => {
    const farLocation = { lng: -74.0445, lat: 40.6892 };

    const guessPayload: Guess = {
      landmarkId: "eiffel",
      location: farLocation,
      precision: PrecisionLevel.VAGUE,
    };

    const res = await request(server)
      .post("/api/landmarks/guess")
      .send(guessPayload);
    expect(res.status).toBe(200);

    const body = res.body as GuessResult;
    expect(body.isCorrect).toBe(false);
    expect(body.achievedPrecision).toBeNull();
    expect(body.distanceKm).toBeGreaterThanOrEqual(PRECISION_RADII_KM.VAGUE);
    expect(body.availablePrecisions).toEqual([]);
  });

  it("returns exact location match with zero distance", async () => {
    const eiffelLocation = { lng: 2.2945, lat: 48.8584 };

    const guessPayload: Guess = {
      landmarkId: "eiffel",
      location: eiffelLocation,
      precision: PrecisionLevel.EXACT,
    };

    const res = await request(server)
      .post("/api/landmarks/guess")
      .send(guessPayload);
    expect(res.status).toBe(200);

    const body = res.body as GuessResult;
    expect(body.isCorrect).toBe(true);
    expect(body.achievedPrecision).toBe(PrecisionLevel.EXACT);
    expect(body.distanceKm).toBeCloseTo(0, 1);
    expect(body.availablePrecisions).toEqual([]);
  });

  it("returns incorrect when EXACT precision guess is outside radius", async () => {
    const outsideExactLocation = { lng: 2.9, lat: 49.4 };

    const guessPayload: Guess = {
      landmarkId: "eiffel",
      location: outsideExactLocation,
      precision: PrecisionLevel.EXACT,
    };

    const res = await request(server)
      .post("/api/landmarks/guess")
      .send(guessPayload);
    expect(res.status).toBe(200);

    const body = res.body as GuessResult;
    expect(body.isCorrect).toBe(false);
    expect(body.achievedPrecision).toBeNull();
    expect(body.distanceKm).toBeGreaterThan(PRECISION_RADII_KM.EXACT);
    expect(body.availablePrecisions).toEqual([]);
  });
});
