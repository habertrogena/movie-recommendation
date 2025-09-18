import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { getDocs, deleteDoc } from "firebase/firestore";

jest.mock("@/hooks/useAuth");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
}));

jest.mock("@/components/LoadingMovies", () => () => <div>LoadingMovies</div>);
jest.mock("@/components/ErrorMessage", () => ({ message }: any) => (
  <div>Error: {message}</div>
));
jest.mock(
  "@/components/dashboard/WatchlistGrid",
  () =>
    ({ movies, onRemove }: any) => (
      <div>
        WatchlistGrid
        {movies.map((m: any) => (
          <button key={m.id} onClick={() => onRemove(m.id)}>
            Remove {m.title}
          </button>
        ))}
      </div>
    ),
);
jest.mock("@/components/dashboard/WatchlistEmpty", () => () => (
  <div>WatchlistEmpty</div>
));

describe("DashboardPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it("shows LoadingMovies when loading", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });

    render(<DashboardPage />);
    expect(screen.getByText("LoadingMovies")).toBeInTheDocument();
  });

  it("redirects to / if not logged in", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

    render(<DashboardPage />);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("shows error when fetching fails", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "123" },
      loading: false,
    });

    (getDocs as jest.Mock).mockRejectedValue(new Error("Firestore error"));

    render(<DashboardPage />);

    await waitFor(() =>
      expect(screen.getByText(/Failed to load watchlist/)).toBeInTheDocument(),
    );
  });

  it("shows WatchlistEmpty when no movies", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "123" },
      loading: false,
    });

    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    render(<DashboardPage />);

    await waitFor(() =>
      expect(screen.getByText("WatchlistEmpty")).toBeInTheDocument(),
    );
  });

  it("renders WatchlistGrid with movies", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "123" },
      loading: false,
    });

    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        { id: "1", data: () => ({ title: "Movie A" }) },
        { id: "2", data: () => ({ title: "Movie B" }) },
      ],
    });

    render(<DashboardPage />);

    await waitFor(() =>
      expect(screen.getByText("WatchlistGrid")).toBeInTheDocument(),
    );
    expect(screen.getByText("Remove Movie A")).toBeInTheDocument();
    expect(screen.getByText("Remove Movie B")).toBeInTheDocument();
  });

  it("removes movie from state and calls deleteDoc", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "123" },
      loading: false,
    });

    (getDocs as jest.Mock).mockResolvedValue({
      docs: [{ id: "1", data: () => ({ title: "Movie A" }) }],
    });

    render(<DashboardPage />);

    const removeBtn = await screen.findByText("Remove Movie A");
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalled();
      expect(screen.queryByText("Remove Movie A")).not.toBeInTheDocument();
    });
  });
});
