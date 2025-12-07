import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import ResultDisplay from "../../src/components/ResultDisplay";
import {
  EXACT_CORRECT_RESULT,
  NARROW_CORRECT_RESULT,
  VAGUE_CORRECT_RESULT,
  INCORRECT_RESULT,
} from "../fixtures/landmarks";

describe("ResultDisplay", () => {
  const mockOnPlayAgain = vi.fn();

  it("renders landmark name as title", () => {
    render(
      <ResultDisplay
        result={EXACT_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    expect(screen.getByText("Eiffel Tower")).toBeInTheDocument();
  });

  it("landmark name is a link to Wikipedia", () => {
    render(
      <ResultDisplay
        result={EXACT_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    const link = screen.getByRole("link", { name: "Eiffel Tower" });
    expect(link).toHaveAttribute(
      "href",
      "https://en.wikipedia.org/wiki/Eiffel_Tower",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("displays distance without decimal places", () => {
    render(
      <ResultDisplay
        result={EXACT_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    expect(screen.getByText("1 km away")).toBeInTheDocument();
  });

  it("displays distance for larger values", () => {
    render(
      <ResultDisplay
        result={NARROW_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    expect(screen.getByText("75 km away")).toBeInTheDocument();
  });

  it("displays wiki summary", () => {
    render(
      <ResultDisplay
        result={EXACT_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    expect(
      screen.getByText(/The Eiffel Tower is a wrought-iron lattice tower/),
    ).toBeInTheDocument();
  });

  it("applies exact CSS class for EXACT precision", () => {
    const { container } = render(
      <ResultDisplay
        result={EXACT_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    const resultContainer = container.firstChild as HTMLElement;
    expect(resultContainer.className).toContain("exact");
  });

  it("applies narrow CSS class for NARROW precision", () => {
    const { container } = render(
      <ResultDisplay
        result={NARROW_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    const resultContainer = container.firstChild as HTMLElement;
    expect(resultContainer.className).toContain("narrow");
  });

  it("applies vague CSS class for VAGUE precision", () => {
    const { container } = render(
      <ResultDisplay
        result={VAGUE_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    const resultContainer = container.firstChild as HTMLElement;
    expect(resultContainer.className).toContain("vague");
  });

  it("applies incorrect CSS class for incorrect result", () => {
    const { container } = render(
      <ResultDisplay
        result={INCORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    const resultContainer = container.firstChild as HTMLElement;
    expect(resultContainer.className).toContain("incorrect");
  });

  it("displays correct at exact precision message", () => {
    render(
      <ResultDisplay
        result={EXACT_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    expect(screen.getByText("Correct at exact precision!")).toBeInTheDocument();
  });

  it("displays correct at narrow precision message", () => {
    render(
      <ResultDisplay
        result={NARROW_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    expect(
      screen.getByText("Correct at narrow precision!"),
    ).toBeInTheDocument();
  });

  it("displays correct at vague precision message", () => {
    render(
      <ResultDisplay
        result={VAGUE_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    expect(screen.getByText("Correct at vague precision!")).toBeInTheDocument();
  });

  it("displays incorrect message for wrong guess", () => {
    render(
      <ResultDisplay
        result={INCORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    expect(screen.getByText("Incorrect")).toBeInTheDocument();
  });

  it("shows next step message when retry is available", () => {
    render(
      <ResultDisplay
        result={VAGUE_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={false}
      />,
    );

    expect(
      screen.getByText("You can now try a more precise guess!"),
    ).toBeInTheDocument();
  });

  it("does not show next step message when no retry available", () => {
    render(
      <ResultDisplay
        result={EXACT_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    expect(
      screen.queryByText("You can now try a more precise guess!"),
    ).not.toBeInTheDocument();
  });

  it("shows Play Again button when showPlayAgain is true", () => {
    render(
      <ResultDisplay
        result={EXACT_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    expect(screen.getByText("Play Again")).toBeInTheDocument();
  });

  it("does not show Play Again button when showPlayAgain is false", () => {
    render(
      <ResultDisplay
        result={VAGUE_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={false}
      />,
    );

    expect(screen.queryByText("Play Again")).not.toBeInTheDocument();
  });

  it("calls onPlayAgain when Play Again button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ResultDisplay
        result={EXACT_CORRECT_RESULT}
        landmarkName="Eiffel Tower"
        onPlayAgain={mockOnPlayAgain}
        showPlayAgain={true}
      />,
    );

    const button = screen.getByText("Play Again");
    await user.click(button);

    expect(mockOnPlayAgain).toHaveBeenCalledTimes(1);
  });
});
