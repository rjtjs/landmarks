import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LandmarkImages from "../../src/components/LandmarkImages";

describe("LandmarkImages", () => {
  it("renders heading", () => {
    render(<LandmarkImages images={[]} />);
    expect(screen.getByText("Where is this landmark?")).toBeInTheDocument();
  });

  it("renders images from the images array", () => {
    const images = [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
    ];

    render(<LandmarkImages images={images} />);

    const imgElements = screen.getAllByRole("img");
    expect(imgElements).toHaveLength(3);
    expect(imgElements[0]).toHaveAttribute("src", images[0]);
    expect(imgElements[1]).toHaveAttribute("src", images[1]);
    expect(imgElements[2]).toHaveAttribute("src", images[2]);
  });

  it("uses landmark name in alt text when provided", () => {
    const images = ["https://example.com/image1.jpg"];

    render(<LandmarkImages images={images} name="Eiffel Tower" />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Eiffel Tower 1");
  });

  it("uses generic alt text when name is not provided", () => {
    const images = ["https://example.com/image1.jpg"];

    render(<LandmarkImages images={images} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Landmark 1");
  });
});
