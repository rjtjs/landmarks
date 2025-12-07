import {
  PrecisionLevel,
  PRECISION_POINTS,
  type PrecisionLevelType,
} from "@landmarks/shared";
import styles from "./PrecisionSelector.module.css";

interface PrecisionSelectorProps {
  selectedPrecision: PrecisionLevelType;
  onPrecisionChange: (precision: PrecisionLevelType) => void;
  availablePrecisions: PrecisionLevelType[];
  disabled?: boolean;
}

export default function PrecisionSelector({
  selectedPrecision,
  onPrecisionChange,
  availablePrecisions,
  disabled = false,
}: PrecisionSelectorProps) {
  const allPrecisions: PrecisionLevelType[] = [
    PrecisionLevel.VAGUE,
    PrecisionLevel.NARROW,
    PrecisionLevel.EXACT,
  ];

  const isDisabled = (precision: PrecisionLevelType) => {
    return disabled || !availablePrecisions.includes(precision);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Precision:</label>
      <div className={styles.options}>
        {allPrecisions.map((precision) => {
          const points = PRECISION_POINTS[precision];
          return (
            <label
              key={precision}
              className={`${styles.option} ${isDisabled(precision) ? styles.optionDisabled : ""}`}
            >
              <input
                type="radio"
                name="precision"
                value={precision}
                checked={selectedPrecision === precision}
                onChange={() => onPrecisionChange(precision)}
                disabled={isDisabled(precision)}
                className={styles.radio}
              />
              <span className={styles.optionLabel}>
                {points} {points === 1 ? "point" : "points"}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
