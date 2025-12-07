import { PrecisionLevel, type GuessResult } from "@landmarks/shared";
import styles from "./ResultDisplay.module.css";

interface ResultDisplayProps {
  result: GuessResult;
  landmarkName: string;
  onPlayAgain: () => void;
  showPlayAgain: boolean;
}

export default function ResultDisplay({
  result,
  landmarkName,
  onPlayAgain,
  showPlayAgain,
}: ResultDisplayProps) {
  const getPrecisionClass = (precision: string | null) => {
    if (!precision) return styles.incorrect;

    switch (precision) {
      case PrecisionLevel.EXACT:
        return styles.exact;
      case PrecisionLevel.NARROW:
        return styles.narrow;
      case PrecisionLevel.VAGUE:
        return styles.vague;
      default:
        return styles.incorrect;
    }
  };

  const getPrecisionLabel = () => {
    if (!result.isCorrect) {
      return "Incorrect";
    }
    if (result.achievedPrecision) {
      const precision = result.achievedPrecision.toLowerCase();
      return `Correct at ${precision} precision!`;
    }
    return "Incorrect";
  };

  const getNextStepMessage = () => {
    if (!result.isCorrect) {
      return null;
    }
    if (result.availablePrecisions.length > 0) {
      return "You can now try a more precise guess!";
    }
    return null;
  };

  return (
    <div
      className={`${styles.container} ${getPrecisionClass(result.achievedPrecision)}`}
    >
      <h2 className={styles.title}>
        <a
          href={result.wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.titleLink}
        >
          {landmarkName}
        </a>
      </h2>
      <p className={styles.precisionText}>{getPrecisionLabel()}</p>
      <p className={styles.distanceText}>
        {result.distanceKm.toFixed(0)} km away
      </p>
      {getNextStepMessage() && (
        <p className={styles.nextStepMessage}>{getNextStepMessage()}</p>
      )}
      <p className={styles.summary}>{result.wikiSummary}</p>
      {showPlayAgain && (
        <button onClick={onPlayAgain} className={styles.button}>
          Play Again
        </button>
      )}
    </div>
  );
}
