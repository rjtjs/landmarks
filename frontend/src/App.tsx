import { useEffect, useState } from "react";
import type {
  LngLat,
  LandmarkWithoutLocation,
  GuessResult,
  PrecisionLevelType,
} from "@landmarks/shared";
import { PrecisionLevel } from "@landmarks/shared";
import { getRandomLandmark, submitGuess } from "./services/api";
import { getItem, setItem } from "./utils/localStorage";
import Map from "./components/Map";
import LandmarkImages from "./components/LandmarkImages";
import ResultDisplay from "./components/ResultDisplay";
import PrecisionSelector from "./components/PrecisionSelector";
import ThemeToggle from "./components/ThemeToggle";
import styles from "./App.module.css";

export default function App() {
  const [landmark, setLandmark] = useState<LandmarkWithoutLocation | null>(
    null,
  );
  const [guessLocation, setGuessLocation] = useState<LngLat | null>(null);
  const [selectedPrecision, setSelectedPrecision] =
    useState<PrecisionLevelType>(PrecisionLevel.VAGUE);
  const [availablePrecisions, setAvailablePrecisions] = useState<
    PrecisionLevelType[]
  >([PrecisionLevel.VAGUE, PrecisionLevel.NARROW, PrecisionLevel.EXACT]);
  const [result, setResult] = useState<GuessResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedState = getItem("gameState");
    if (savedState && savedState.landmark) {
      setLandmark(savedState.landmark);
      setGuessLocation(savedState.guessLocation);
      setResult(savedState.result);
      if (savedState.availablePrecisions) {
        setAvailablePrecisions(savedState.availablePrecisions);
      }
      if (savedState.selectedPrecision) {
        setSelectedPrecision(savedState.selectedPrecision);
      }
    } else {
      loadLandmark();
    }
  }, []);

  useEffect(() => {
    if (landmark) {
      setItem("gameState", {
        landmark,
        guessLocation,
        result,
        availablePrecisions,
        selectedPrecision,
      });
    }
  }, [landmark, guessLocation, result, availablePrecisions, selectedPrecision]);

  async function loadLandmark() {
    try {
      setLoading(true);
      setError(null);
      const data = await getRandomLandmark();
      setLandmark(data);
      setGuessLocation(null);
      setResult(null);
      setSelectedPrecision(PrecisionLevel.VAGUE);
      setAvailablePrecisions([
        PrecisionLevel.VAGUE,
        PrecisionLevel.NARROW,
        PrecisionLevel.EXACT,
      ]);
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
        precision: selectedPrecision,
      });
      setResult(guessResult);

      if (guessResult.isCorrect && guessResult.availablePrecisions.length > 0) {
        setAvailablePrecisions(guessResult.availablePrecisions);
        setGuessLocation(null);
      } else {
        setAvailablePrecisions([]);
      }
    } catch (err) {
      setError("Failed to submit guess");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handlePlayAgain() {
    setGuessLocation(null);
    setResult(null);
    setSelectedPrecision(PrecisionLevel.VAGUE);
    setAvailablePrecisions([
      PrecisionLevel.VAGUE,
      PrecisionLevel.NARROW,
      PrecisionLevel.EXACT,
    ]);
    loadLandmark();
  }

  const isGameEnded = !!(
    result &&
    (result.availablePrecisions.length === 0 || !result.isCorrect)
  );

  if (loading && !landmark) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.title}>Where in the World?</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error && !landmark) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.title}>Where in the World?</h1>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <p>Make sure the backend is running on port 3000</p>
        </div>
        <button className={styles.button} onClick={loadLandmark}>
          Retry
        </button>
      </div>
    );
  }

  if (!landmark) {
    return (
      <div className={styles.loadingContainer}>
        <h1 className={styles.title}>Where in the World?</h1>
        <p>No landmark loaded</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ThemeToggle />
      <h1 className={styles.title}>Where in the World?</h1>

      {landmark && (
        <LandmarkImages images={landmark.images} name={landmark.name} />
      )}

      <PrecisionSelector
        selectedPrecision={selectedPrecision}
        onPrecisionChange={setSelectedPrecision}
        availablePrecisions={availablePrecisions}
        disabled={!!isGameEnded}
      />

      <Map
        onLocationSelect={setGuessLocation}
        guessLocation={guessLocation}
        selectedPrecision={selectedPrecision}
        {...(isGameEnded &&
          result && { actualLocation: result.actualLocation })}
        achievedPrecision={result?.achievedPrecision || null}
        disabled={!!isGameEnded}
      />

      {!isGameEnded && guessLocation && (
        <button
          onClick={handleSubmitGuess}
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Submitting..." : "Submit Guess"}
        </button>
      )}

      {result && landmark && (
        <ResultDisplay
          result={result}
          landmarkName={landmark.name}
          onPlayAgain={handlePlayAgain}
          showPlayAgain={isGameEnded}
        />
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
