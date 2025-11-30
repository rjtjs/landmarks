import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import cors from "cors";
import router from "../src/routes/index";
import errorHandler from "../src/middleware/errors";
import { Server } from "http";

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
    const guessPayload = {
      landmarkId: "eiffel",
      guess: { lat: 48.85, lng: 2.3 },
    };

    const res = await request(server).post("/api/landmarks/guess").send(guessPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("distanceKm");
    expect(res.body).toHaveProperty("correct");
    expect(res.body).toHaveProperty("wiki");
    expect(res.body.wiki).toHaveProperty("extract");
    expect(res.body.wiki).toHaveProperty("url");
  });

  it("POST /api/landmarks/guess with invalid id returns 400", async () => {
    const res = await request(server)
      .post("/api/landmarks/guess")
      .send({ landmarkId: "invalid", guess: { lat: 0, lng: 0 } });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
