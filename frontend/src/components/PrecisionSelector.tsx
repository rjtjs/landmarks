import {
  PrecisionLevel,
  PRECISION_POINTS,
  type PrecisionLevelType,
} from "@landmarks/shared";
import styles from "./PrecisionSelector.module.css";

interface PrecisionSelectorProps {
  selectedPrecision: PrecisionLevelType;
  onPrecisionChange: (precision: PrecisionLevelType) => void;
  disabled?: boolean;
}

export default function PrecisionSelector({
  selectedPrecision,
  onPrecisionChange,
  disabled = false,
}: PrecisionSelectorProps) {
  const allPrecisions: PrecisionLevelType[] = [
    PrecisionLevel.VAGUE,
    PrecisionLevel.NARROW,
    PrecisionLevel.EXACT,
  ];

  return (
    <div className={styles.container}>
      <label className={styles.label}>Precision:</label>
      <div className={styles.options}>
        {allPrecisions.map((precision) => {
          const points = PRECISION_POINTS[precision];
          return (
            <label
              key={precision}
              className={`${styles.option} ${disabled ? styles.optionDisabled : ""}`}
            >
              <input
                type="radio"
                name="precision"
                value={precision}
                checked={selectedPrecision === precision}
                onChange={() => onPrecisionChange(precision)}
                disabled={disabled}
                className={styles.radio}
              />
              <span className={styles.optionLabel}>{points} points</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
