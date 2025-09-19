import PaginationControls from "@/components/PaginationControls";
import { render, screen, fireEvent } from "@testing-library/react";
import { useMediaQuery as mockedUseMediaQuery } from "react-responsive";

// Mock react-responsive
jest.mock("react-responsive", () => ({
  useMediaQuery: jest.fn(),
}));

describe("PaginationControls", () => {
  const onPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("disables 'Previous' button on first page", () => {
    (mockedUseMediaQuery as jest.Mock).mockReturnValue(false); // desktop
    render(
      <PaginationControls
        page={1}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );
    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("disables 'Next' button on last page", () => {
    (mockedUseMediaQuery as jest.Mock).mockReturnValue(false); // desktop
    render(
      <PaginationControls
        page={5}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("calls onPageChange when clicking 'Previous' or 'Next'", () => {
    (mockedUseMediaQuery as jest.Mock).mockReturnValue(false);
    render(
      <PaginationControls
        page={3}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );
    fireEvent.click(screen.getByText("Previous"));
    fireEvent.click(screen.getByText("Next"));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("renders mobile view with page text", () => {
    (mockedUseMediaQuery as jest.Mock).mockReturnValue(true); // mobile
    render(
      <PaginationControls
        page={2}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );
    expect(screen.getByText("Page 2 / 5")).toBeInTheDocument();
  });

  it("renders all pages when totalPages <= 7 (desktop)", () => {
    (mockedUseMediaQuery as jest.Mock).mockReturnValue(false);
    render(
      <PaginationControls
        page={3}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );
    expect(screen.getByText("1")).toBeDisabled(); // first
    expect(screen.getByText("5")).toBeDisabled(); // last
    expect(screen.getByText("3")).toHaveClass("bg-blue-500 text-white"); // active
  });

  it("renders ellipsis when totalPages > 7", () => {
    (mockedUseMediaQuery as jest.Mock).mockReturnValue(false);
    render(
      <PaginationControls
        page={5}
        totalPages={10}
        onPageChange={onPageChange}
      />,
    );
    expect(screen.getAllByText("...").length).toBeGreaterThan(0);
  });

  it("calls onPageChange when clicking a middle page number", () => {
    (mockedUseMediaQuery as jest.Mock).mockReturnValue(false);
    render(
      <PaginationControls
        page={5}
        totalPages={10}
        onPageChange={onPageChange}
      />,
    );
    fireEvent.click(screen.getByText("6")); // middle page
    expect(onPageChange).toHaveBeenCalledWith(6);
  });
});
