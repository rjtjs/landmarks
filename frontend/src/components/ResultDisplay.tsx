import { PrecisionLevel, type GuessResult } from "@landmarks/shared";
import styles from "./ResultDisplay.module.css";

interface ResultDisplayProps {
  result: GuessResult;
  landmarkName: string;
  onPlayAgain: () => void;
}

const PRECISION_CLASSES = {
  [PrecisionLevel.EXACT]: styles.exact,
  [PrecisionLevel.NARROW]: styles.narrow,
  [PrecisionLevel.VAGUE]: styles.vague,
};

export default function ResultDisplay({
  result,
  landmarkName,
  onPlayAgain,
}: ResultDisplayProps) {
  const precisionClass = result.achievedPrecision
    ? PRECISION_CLASSES[result.achievedPrecision] || styles.incorrect
    : styles.incorrect;

  return (
    <div className={`${styles.container} ${precisionClass}`}>
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
      <button onClick={onPlayAgain} className={styles.button}>
        Play Again
      </button>
    </div>
  );
}
