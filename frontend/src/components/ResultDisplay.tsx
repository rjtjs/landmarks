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
      {showPlayAgain && (
        <button onClick={onPlayAgain} className={styles.button}>
          Play Again
        </button>
      )}
    </div>
  );
}
