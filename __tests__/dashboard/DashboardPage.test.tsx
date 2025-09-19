// __tests__/dashboard/DashboardPage.test.tsx
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "@/app/dashboard/page";

// Mock hooks and Firebase
jest.mock("@/hooks/useAuth");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
}));

// Mock child components to simplify test render
jest.mock("@/components/LoadingMovies", () => () => <div>LoadingMovies</div>);
jest.mock(
  "@/components/ErrorMessage",
  () =>
    ({ message }: { message: string }) => <div>{message}</div>,
);
jest.mock(
  "@/components/dashboard/WatchlistGrid",
  () =>
    ({ movies, onRemove }: any) => (
      <div>
        {movies.map((m: any) => (
          <div key={m.id}>
            {m.title}
            <button onClick={() => onRemove(m.id)}>Remove</button>
          </div>
        ))}
      </div>
    ),
);
jest.mock("@/components/dashboard/WatchlistEmpty", () => () => (
  <div>WatchlistEmpty</div>
));
jest.mock("@/components/dashboard/RecommendedMovies", () => () => (
  <div>RecommendedMovies</div>
));

// QueryClient wrapper
const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("DashboardPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("shows loading while auth is loading", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });
    render(<DashboardPage />, { wrapper: createWrapper() });
    expect(screen.getByText("LoadingMovies")).toBeInTheDocument();
  });

  it("redirects to homepage if no user", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });
    render(<DashboardPage />, { wrapper: createWrapper() });
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"));
  });

  it("renders empty watchlist when no movies", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "123" },
      loading: false,
    });
    (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

    render(<DashboardPage />, { wrapper: createWrapper() });

    await waitFor(() =>
      expect(screen.getByText("WatchlistEmpty")).toBeInTheDocument(),
    );
  });

  it("renders watchlist movies and allows removal", async () => {
    const mockMovies = [
      {
        id: 1,
        title: "Movie 1",
        poster_path: null,
        backdrop_path: null,
        release_date: "",
        vote_average: 0,
        genres: [],
      },
    ];

    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "123" },
      loading: false,
    });
    (getDocs as jest.Mock).mockResolvedValue({
      docs: mockMovies.map((m) => ({ id: m.id.toString(), data: () => m })),
    });
    (deleteDoc as jest.Mock).mockResolvedValue(true);

    render(<DashboardPage />, { wrapper: createWrapper() });

    await waitFor(() =>
      expect(screen.getByText("Movie 1")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText("Remove"));
    await waitFor(() => expect(deleteDoc).toHaveBeenCalled());
  });

  it("renders error message when fetch fails", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { uid: "123" },
      loading: false,
    });
    (getDocs as jest.Mock).mockRejectedValue(new Error("Firestore error"));

    render(<DashboardPage />, { wrapper: createWrapper() });

    await waitFor(() =>
      expect(
        screen.getByText(/Failed to load watchlist. Please try again./),
      ).toBeInTheDocument(),
    );
  });
});
