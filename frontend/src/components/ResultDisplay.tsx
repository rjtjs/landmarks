import { CorrectnessLevel, type GuessResult } from "@landmarks/shared";

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
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        border: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2>Result</h2>
      <p>
        <strong>Correctness:</strong> {getCorrectnessText(result.correctness)}
      </p>
      <p>
        <strong>Distance:</strong> {result.distanceKm.toFixed(2)} km
      </p>
      <p>
        <strong>Location:</strong> {landmarkName}
      </p>
      <div style={{ marginTop: "10px" }}>
        <h3>About</h3>
        <p>{result.wikiSummary}</p>
        <a href={result.wikiUrl} target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </div>
      <button
        onClick={onPlayAgain}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          fontSize: "16px",
        }}
      >
        Play Again
      </button>
    </div>
  );
}
