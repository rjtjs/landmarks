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
  const getCorrectnessText = (correctness: string) => {
    switch (correctness) {
      case CorrectnessLevel.CORRECT:
        return "Correct!";
      case CorrectnessLevel.CLOSE:
        return "Close!";
      case CorrectnessLevel.INCORRECT:
        return "Incorrect";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Result</h2>
      <div className={styles.infoRow}>
        <span className={styles.label}>Correctness:</span>
        {getCorrectnessText(result.correctness)}
      </div>
      <div className={styles.infoRow}>
        <span className={styles.label}>Distance:</span>
        {result.distanceKm.toFixed(2)} km
      </div>
      <div className={styles.infoRow}>
        <span className={styles.label}>Location:</span>
        {landmarkName}
      </div>
      <div className={styles.aboutSection}>
        <h3 className={styles.aboutTitle}>About</h3>
        <p className={styles.summary}>{result.wikiSummary}</p>
        <a
          href={result.wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Read more
        </a>
      </div>
      <button onClick={onPlayAgain} className={styles.playAgainButton}>
        Play Again
      </button>
    </div>
  );
}
