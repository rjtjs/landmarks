import cors from "cors";
import express from "express";
import { Server } from "http";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import errorHandler from "../../src/middleware/errors";
import router from "../../src/routes/index";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

describe("Landmark validation", () => {
  let server: Server;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(() => {
    return new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it("rejects guess with missing landmarkId", async () => {
    const res = await request(server)
      .post("/api/landmarks/guess")
      .send({ location: { lng: 0, lat: 0 } });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Invalid request body");
  });

  it("rejects guess with empty body", async () => {
    const res = await request(server).post("/api/landmarks/guess").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("handles missing location gracefully", async () => {
    const res = await request(server)
      .post("/api/landmarks/guess")
      .send({ landmarkId: "eiffel" });

    expect([400, 500]).toContain(res.status);
  });

  it("validates all known landmark IDs work", async () => {
    const landmarkIds = ["eiffel", "taj", "statueOfLiberty"];

    for (const id of landmarkIds) {
      const res = await request(server)
        .post("/api/landmarks/guess")
        .send({ landmarkId: id, location: { lng: 0, lat: 0 } });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("correctness");
      expect(res.body).toHaveProperty("distanceKm");
    }
  });

  it("handles extreme coordinate values", async () => {
    const res = await request(server)
      .post("/api/landmarks/guess")
      .send({ landmarkId: "eiffel", location: { lng: 180, lat: 90 } });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("distanceKm");
    expect(res.body.distanceKm).toBeGreaterThan(0);
  });

  it("rejects invalid longitude (> 180)", async () => {
    const res = await request(server)
      .post("/api/landmarks/guess")
      .send({ landmarkId: "eiffel", location: { lng: 181, lat: 0 } });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid request body");
  });

  it("rejects invalid longitude (< -180)", async () => {
    const res = await request(server)
      .post("/api/landmarks/guess")
      .send({ landmarkId: "eiffel", location: { lng: -181, lat: 0 } });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid request body");
  });

  it("rejects invalid latitude (> 90)", async () => {
    const res = await request(server)
      .post("/api/landmarks/guess")
      .send({ landmarkId: "eiffel", location: { lng: 0, lat: 91 } });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid request body");
  });

  it("rejects invalid latitude (< -90)", async () => {
    const res = await request(server)
      .post("/api/landmarks/guess")
      .send({ landmarkId: "eiffel", location: { lng: 0, lat: -91 } });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid request body");
  });

  it("rejects non-numeric coordinates", async () => {
    const res = await request(server)
      .post("/api/landmarks/guess")
      .send({
        landmarkId: "eiffel",
        location: { lng: "invalid", lat: "invalid" },
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid request body");
  });

  it("rejects empty landmarkId", async () => {
    const res = await request(server)
      .post("/api/landmarks/guess")
      .send({ landmarkId: "", location: { lng: 0, lat: 0 } });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid request body");
  });
});
