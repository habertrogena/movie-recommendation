import { render, screen, fireEvent } from "@testing-library/react";
import WatchlistGrid from "@/components/dashboard/WatchlistGrid";

describe("WatchlistGrid", () => {
  const mockMovies = [
    { id: 1, title: "Inception" },
    { id: 2, title: "The Dark Knight" },
  ];
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a list of movies", () => {
    render(<WatchlistGrid movies={mockMovies} onRemove={mockOnRemove} />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("The Dark Knight")).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", () => {
    render(<WatchlistGrid movies={mockMovies} onRemove={mockOnRemove} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });

    fireEvent.click(removeButtons[0]); // Click first movie's remove button
    expect(mockOnRemove).toHaveBeenCalledWith(1);

    fireEvent.click(removeButtons[1]); // Click second movie's remove button
    expect(mockOnRemove).toHaveBeenCalledWith(2);
  });
});
