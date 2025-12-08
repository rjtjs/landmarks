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

const PRECISIONS: PrecisionLevelType[] = [
  PrecisionLevel.VAGUE,
  PrecisionLevel.NARROW,
  PrecisionLevel.EXACT,
];

export default function PrecisionSelector({
  selectedPrecision,
  onPrecisionChange,
  disabled = false,
}: PrecisionSelectorProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>Precision:</label>
      <div className={styles.options}>
        {PRECISIONS.map((precision) => (
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
            <span className={styles.optionLabel}>
              {PRECISION_POINTS[precision]} points
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
