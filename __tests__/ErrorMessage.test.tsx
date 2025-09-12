import { render, screen } from "@testing-library/react";
import ErrorMessage from "@/components/ErrorMessage";

describe("ErrorMessage", () => {
  it("renders default error message", () => {
    render(<ErrorMessage />);
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("renders custom error message", () => {
    render(<ErrorMessage message="Failed to fetch movies." />);
    expect(screen.getByText("Failed to fetch movies.")).toBeInTheDocument();
  });
});
