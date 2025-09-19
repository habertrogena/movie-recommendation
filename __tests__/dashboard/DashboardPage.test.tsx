import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { WatchlistMovie } from "@/services/watchlistService";

// Mock components
jest.mock("@/components/LoadingMovies", () => () => <div>LoadingMovies</div>);
jest.mock(
  "@/components/ErrorMessage",
  () =>
    ({ message }: { message: string }) => <div>{message}</div>,
);
jest.mock(
  "@/components/dashboard/WatchlistGrid",
  () =>
    ({
      movies,
      onRemove,
    }: {
      movies: WatchlistMovie[];
      onRemove: (id: number) => void;
    }) => (
      <div>
        {movies.map((m) => (
          <div key={m.id}>
            {m.title} <button onClick={() => onRemove(m.id)}>Remove</button>
          </div>
        ))}
      </div>
    ),
);
jest.mock("@/components/dashboard/WatchlistEmpty", () => () => (
  <div>No movies</div>
));
jest.mock("@/components/dashboard/RecommendedMovies", () => () => (
  <div>RecommendedMovies</div>
));

// Mock hooks
jest.mock("@/hooks/useAuth");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock Firestore functions
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

describe("DashboardPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("redirects to home if user is not logged in", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

    render(<DashboardPage />);

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"));
  });

  it("renders loading state initially", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });

    render(<DashboardPage />);
    expect(screen.getByText("LoadingMovies")).toBeInTheDocument();
  });

  it("renders error message if fetching watchlist fails", async () => {
    const mockUser = { uid: "mock-uid" };
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
    (getDocs as jest.Mock).mockRejectedValueOnce(new Error("fetch error"));

    render(<DashboardPage />);
    await waitFor(() =>
      expect(screen.getByText(/failed to load watchlist/i)).toBeInTheDocument(),
    );
  });

  it("renders WatchlistEmpty when there are no movies", async () => {
    const mockUser = { uid: "mock-uid" };
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    render(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText("No movies")).toBeInTheDocument();
    });
  });

  it("renders WatchlistGrid with movies and allows removal", async () => {
    const mockUser = { uid: "mock-uid" };
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });

    const movies: WatchlistMovie[] = [
      {
        id: 1,
        title: "Movie 1",
        poster_path: null,
        backdrop_path: null,
        release_date: "",
        vote_average: 0,
        genres: [],
      },
      {
        id: 2,
        title: "Movie 2",
        poster_path: null,
        backdrop_path: null,
        release_date: "",
        vote_average: 0,
        genres: [],
      },
    ];

    (collection as jest.Mock).mockReturnValue("ref");
    (getDocs as jest.Mock).mockResolvedValue({
      docs: movies.map((m) => ({ id: m.id.toString(), data: () => m })),
    });
    (doc as jest.Mock).mockImplementation(
      (db, path1, path2, path3, path4) => `${path1}-${path2}-${path3}-${path4}`,
    );
    (deleteDoc as jest.Mock).mockResolvedValue(null);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Movie 1")).toBeInTheDocument();
      expect(screen.getByText("Movie 2")).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByText("Remove", { selector: "button" });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("Movie 1")).not.toBeInTheDocument();
      expect(screen.getByText("Movie 2")).toBeInTheDocument();
    });
  });

  it("renders RecommendedMovies component", async () => {
    const mockUser = { uid: "mock-uid" };
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    render(<DashboardPage />);
    await waitFor(() =>
      expect(screen.getByText("RecommendedMovies")).toBeInTheDocument(),
    );
  });
});
