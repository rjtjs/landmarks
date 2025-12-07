import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type {
  LngLat,
  LandmarkWithoutLocation,
  GuessResult,
} from "@landmarks/shared";
import { CorrectnessLevel } from "@landmarks/shared";
import { getRandomLandmark, submitGuess } from "./services/api";

mapboxgl.accessToken =
  (import.meta.env.VITE_MBX_TOKEN as string | undefined) || "";

export default function App() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [landmark, setLandmark] = useState<LandmarkWithoutLocation | null>(
    null,
  );
  const [guessMarker, setGuessMarker] = useState<mapboxgl.Marker | null>(null);
  const [guessLocation, setGuessLocation] = useState<LngLat | null>(null);
  const [result, setResult] = useState<GuessResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultMarker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    loadLandmark();
  }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 20],
      zoom: 1.5,
    });

    map.current.on("click", (e) => {
      if (!map.current || result) return;

      setGuessLocation({ lng: e.lngLat.lng, lat: e.lngLat.lat });

      if (guessMarker) {
        guessMarker.setLngLat(e.lngLat);
      } else {
        const newMarker = new mapboxgl.Marker({ color: "red" })
          .setLngLat(e.lngLat)
          .addTo(map.current);
        setGuessMarker(newMarker);
      }
    });
  }, [guessMarker, result]);

  async function loadLandmark() {
    try {
      setLoading(true);
      setError(null);
      const data = await getRandomLandmark();
      setLandmark(data);
    } catch (err) {
      setError("Failed to load landmark");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitGuess() {
    if (!landmark || !guessLocation) return;

    try {
      setLoading(true);
      setError(null);
      const guessResult = await submitGuess({
        landmarkId: landmark.id,
        location: guessLocation,
      });
      setResult(guessResult);

      if (map.current) {
        if (guessMarker) {
          const color = getMarkerColor(guessResult.correctness);
          guessMarker.getElement().style.filter = `hue-rotate(${color === "green" ? "0" : color === "yellow" ? "60" : "0"}deg)`;
        }

        resultMarker.current = new mapboxgl.Marker({ color: "green" })
          .setLngLat(guessResult.actualLocation)
          .addTo(map.current);
      }
    } catch (err) {
      setError("Failed to submit guess");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getMarkerColor(correctness: CorrectnessLevel): string {
    switch (correctness) {
      case CorrectnessLevel.CORRECT:
        return "green";
      case CorrectnessLevel.CLOSE:
        return "yellow";
      case CorrectnessLevel.INCORRECT:
        return "red";
    }
  }

  function handlePlayAgain() {
    setLandmark(null);
    setGuessLocation(null);
    setResult(null);
    if (guessMarker) {
      guessMarker.remove();
      setGuessMarker(null);
    }
    if (resultMarker.current) {
      resultMarker.current.remove();
      resultMarker.current = null;
    }
    loadLandmark();
  }

  if (loading && !landmark) {
    return <div>Loading...</div>;
  }

  if (error && !landmark) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Landmarks Guessing Game</h1>

      {landmark && (
        <div style={{ marginBottom: "20px" }}>
          <h2>Where is this landmark?</h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            {landmark.images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Landmark ${idx + 1}`}
                style={{
                  width: "300px",
                  height: "200px",
                  objectFit: "cover",
                  border: "1px solid #ccc",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div
        ref={mapContainer}
        style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
      />

      {!result && guessLocation && (
        <button
          onClick={handleSubmitGuess}
          disabled={loading}
          style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}
        >
          {loading ? "Submitting..." : "Submit Guess"}
        </button>
      )}

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>Result</h2>
          <p>
            <strong>Correctness:</strong>{" "}
            {result.correctness === CorrectnessLevel.CORRECT
              ? "Correct!"
              : result.correctness === CorrectnessLevel.CLOSE
                ? "Close!"
                : "Incorrect"}
          </p>
          <p>
            <strong>Distance:</strong> {result.distanceKm.toFixed(2)} km
          </p>
          <p>
            <strong>Location:</strong> {landmark?.name}
          </p>
          <div style={{ marginTop: "10px" }}>
            <h3>About</h3>
            <p>{result.wikiSummary}</p>
            <a href={result.wikiUrl} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
          <button
            onClick={handlePlayAgain}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "16px",
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {error && result && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
