import { render, screen } from "@testing-library/react";
import LoadingMovies from "@/components/LoadingMovies";

describe("LoadingMovies", () => {
  it("renders multiple skeleton cards", () => {
    render(<LoadingMovies />);
    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
