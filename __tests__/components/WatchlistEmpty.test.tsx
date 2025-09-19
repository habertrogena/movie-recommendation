import { render, screen, fireEvent } from "@testing-library/react";
import WatchlistEmpty from "@/components/dashboard/WatchlistEmpty";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("WatchlistEmpty", () => {
  it("renders correctly", () => {
    render(<WatchlistEmpty />);

    expect(
      screen.getByRole("heading", { name: /your watchlist is empty/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/add some movies to your watchlist/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /back to home/i }),
    ).toBeInTheDocument();
  });

  it("navigates to home when button is clicked", () => {
    render(<WatchlistEmpty />);

    const button = screen.getByRole("button", { name: /back to home/i });
    fireEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
