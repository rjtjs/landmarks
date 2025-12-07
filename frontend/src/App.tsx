import { useEffect, useState } from "react";
import type {
  LngLat,
  LandmarkWithoutLocation,
  GuessResult,
} from "@landmarks/shared";
import { CorrectnessLevel } from "@landmarks/shared";
import { getRandomLandmark, submitGuess } from "./services/api";
import Map from "./components/Map";
import LandmarkImages from "./components/LandmarkImages";
import ResultDisplay from "./components/ResultDisplay";
import ThemeToggle from "./components/ThemeToggle";
import styles from "./App.module.css";

export default function App() {
  const [landmark, setLandmark] = useState<LandmarkWithoutLocation | null>(
    null,
  );
  const [guessLocation, setGuessLocation] = useState<LngLat | null>(null);
  const [result, setResult] = useState<GuessResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLandmark();
  }, []);

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
    } catch (err) {
      setError("Failed to submit guess");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getMarkerColor(correctness: string): "red" | "yellow" | "green" {
    switch (correctness) {
      case CorrectnessLevel.CORRECT:
        return "green";
      case CorrectnessLevel.CLOSE:
        return "yellow";
      case CorrectnessLevel.INCORRECT:
      default:
        return "red";
    }
  }

  function handlePlayAgain() {
    setGuessLocation(null);
    setResult(null);
    loadLandmark();
  }

  if (loading && !landmark) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.title}>Landmarks Guessing Game</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error && !landmark) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.title}>Landmarks Guessing Game</h1>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <p>Make sure the backend is running on port 3000</p>
        </div>
        <button className={styles.retryButton} onClick={loadLandmark}>
          Retry
        </button>
      </div>
    );
  }

  if (!landmark) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.title}>Landmarks Guessing Game</h1>
        <p>No landmark loaded</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ThemeToggle />
      <h1 className={styles.title}>Landmarks Guessing Game</h1>

      {landmark && (
        <LandmarkImages images={landmark.images} name={landmark.name} />
      )}

      <Map
        onLocationSelect={setGuessLocation}
        guessLocation={guessLocation}
        {...(result && { actualLocation: result.actualLocation })}
        correctnessColor={result ? getMarkerColor(result.correctness) : "red"}
        disabled={!!result}
      />

      {!result && guessLocation && (
        <button
          onClick={handleSubmitGuess}
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Submitting..." : "Submit Guess"}
        </button>
      )}

      {result && landmark && (
        <ResultDisplay
          result={result}
          landmarkName={landmark.name}
          onPlayAgain={handlePlayAgain}
        />
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
