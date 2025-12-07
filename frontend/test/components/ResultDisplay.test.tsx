import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import ResultDisplay from "../../src/components/ResultDisplay";

describe("ResultDisplay", () => {
  const mockOnPlayAgain = vi.fn();

  const correctResult = {
    correctness: "CORRECT" as const,
    actualLocation: { lng: 2.2945, lat: 48.8584 },
    distanceKm: 0.5,
    wikiSummary: "This is a test landmark summary.",
    wikiUrl: "https://example.com/wiki",
  };

  it("renders result heading", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.getByText("Result")).toBeInTheDocument();
  });

  it("displays correct correctness text for CORRECT", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.getByText("Correct!")).toBeInTheDocument();
  });

  it("displays correct correctness text for CLOSE", () => {
    const closeResult = {
      ...correctResult,
      correctness: "CLOSE" as const,
      distanceKm: 200,
    };

    render(
      <ResultDisplay
        result={closeResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.getByText("Close!")).toBeInTheDocument();
  });

  it("displays correct correctness text for INCORRECT", () => {
    const incorrectResult = {
      ...correctResult,
      correctness: "INCORRECT" as const,
      distanceKm: 1500,
    };

    render(
      <ResultDisplay
        result={incorrectResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.getByText("Incorrect")).toBeInTheDocument();
  });

  it("displays distance with 2 decimal places", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.getByText(/0.50 km/)).toBeInTheDocument();
  });

  it("displays landmark name", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.getByText("Eiffel Tower")).toBeInTheDocument();
  });

  it("displays wiki summary", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(
      screen.getByText("This is a test landmark summary."),
    ).toBeInTheDocument();
  });

  it("displays read more link with correct URL", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    const link = screen.getByText("Read more");
    expect(link).toHaveAttribute("href", "https://example.com/wiki");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("calls onPlayAgain when Play Again button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    const button = screen.getByText("Play Again");
    await user.click(button);

    expect(mockOnPlayAgain).toHaveBeenCalledTimes(1);
  });
});
