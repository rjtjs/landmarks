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

  it("renders landmark name as title", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.getByText("Eiffel Tower")).toBeInTheDocument();
  });

  it("landmark name is a link to Wikipedia", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    const link = screen.getByRole("link", { name: "Test Landmark" });
    expect(link).toHaveAttribute("href", "https://example.com/wiki");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("displays distance without decimal places", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.getByText("1 km away")).toBeInTheDocument();
  });

  it("displays distance for larger values", () => {
    const farResult = {
      ...correctResult,
      distanceKm: 1234.56,
    };

    render(
      <ResultDisplay
        result={farResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.getByText("1235 km away")).toBeInTheDocument();
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

  it("applies correct CSS class for CORRECT result", () => {
    const { container } = render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    const resultContainer = container.firstChild as HTMLElement;
    expect(resultContainer.className).toContain("correct");
  });

  it("applies close CSS class for CLOSE result", () => {
    const closeResult = {
      ...correctResult,
      correctness: "CLOSE" as const,
      distanceKm: 200,
    };

    const { container } = render(
      <ResultDisplay
        result={closeResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    const resultContainer = container.firstChild as HTMLElement;
    expect(resultContainer.className).toContain("close");
  });

  it("applies incorrect CSS class for INCORRECT result", () => {
    const incorrectResult = {
      ...correctResult,
      correctness: "INCORRECT" as const,
      distanceKm: 1500,
    };

    const { container } = render(
      <ResultDisplay
        result={incorrectResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    const resultContainer = container.firstChild as HTMLElement;
    expect(resultContainer.className).toContain("incorrect");
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

  it("does not display correctness text", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.queryByText("Correct!")).not.toBeInTheDocument();
    expect(screen.queryByText("Close!")).not.toBeInTheDocument();
    expect(screen.queryByText("Incorrect")).not.toBeInTheDocument();
  });

  it("does not display Result heading", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.queryByText("Result")).not.toBeInTheDocument();
  });

  it("does not display About heading", () => {
    render(
      <ResultDisplay
        result={correctResult}
        landmarkName="Test Landmark"
        onPlayAgain={mockOnPlayAgain}
      />,
    );

    expect(screen.queryByText("About")).not.toBeInTheDocument();
  });
});
