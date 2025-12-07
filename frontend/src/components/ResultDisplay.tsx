import { CorrectnessLevel, type GuessResult } from "@landmarks/shared";
import styles from "./ResultDisplay.module.css";

interface ResultDisplayProps {
  result: GuessResult;
  landmarkName: string;
  onPlayAgain: () => void;
}

export default function ResultDisplay({
  result,
  landmarkName,
  onPlayAgain,
}: ResultDisplayProps) {
  const getCorrectnessClass = (correctness: string) => {
    switch (correctness) {
      case CorrectnessLevel.CORRECT:
        return styles.correct;
      case CorrectnessLevel.CLOSE:
        return styles.close;
      case CorrectnessLevel.INCORRECT:
        return styles.incorrect;
      default:
        return "";
    }
  };

  return (
    <div
      className={`${styles.container} ${getCorrectnessClass(result.correctness)}`}
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
      <p className={styles.correctnessText}>
        {result.distanceKm.toFixed(0)} km away
      </p>
      <p className={styles.summary}>{result.wikiSummary}</p>
      <button onClick={onPlayAgain} className={styles.button}>
        Play Again
      </button>
    </div>
  );
}
