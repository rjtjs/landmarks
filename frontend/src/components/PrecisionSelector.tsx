import { PrecisionLevel, type PrecisionLevelType } from "@landmarks/shared";
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
      <label className={styles.label}>Precision Level:</label>
      <div className={styles.options}>
        {allPrecisions.map((precision) => (
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
              {precision.charAt(0) + precision.slice(1).toLowerCase()}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
