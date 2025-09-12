import { render, screen, fireEvent } from "@testing-library/react";
import PaginationControls from "@/components/PaginationControls";

describe("PaginationControls", () => {
  it("disables Previous button on first page", () => {
    render(
      <PaginationControls page={1} totalPages={10} onPageChange={() => {}} />
    );
    expect(screen.getByText("Previous")).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    render(
      <PaginationControls page={10} totalPages={10} onPageChange={() => {}} />
    );
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("calls onPageChange when Next is clicked", () => {
    const mockFn = jest.fn();
    render(
      <PaginationControls page={1} totalPages={10} onPageChange={mockFn} />
    );
    fireEvent.click(screen.getByText("Next"));
    expect(mockFn).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange when Previous is clicked", () => {
    const mockFn = jest.fn();
    render(
      <PaginationControls page={5} totalPages={10} onPageChange={mockFn} />
    );
    fireEvent.click(screen.getByText("Previous"));
    expect(mockFn).toHaveBeenCalledWith(4);
  });
});
