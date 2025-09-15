// __tests__/HomePage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "@/app/page";
import { usePopularMovies } from "@/hooks/usePopularMovies";
import { useSearchMovies } from "@/hooks/useSearchMovies";
import { useAuth } from "@/hooks/useAuth";

jest.mock("@/hooks/useAuth");
jest.mock("@/hooks/usePopularMovies");
jest.mock("@/hooks/useSearchMovies");

const mockMovies = {
  page: 1,
  total_pages: 2,
  results: [
    {
      id: 1,
      title: "Inception",
      poster_path: "/inception.jpg",
      overview: "Dream within a dream",
    },
    {
      id: 2,
      title: "Interstellar",
      poster_path: "/interstellar.jpg",
      overview: "Space exploration",
    },
  ],
};

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default auth mock (no user logged in)
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      logout: jest.fn(),
    });
  });

  it("renders loading state", () => {
    (usePopularMovies as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isFetching: false,
    });
    (useSearchMovies as jest.Mock).mockReturnValue({});

    render(<HomePage />);

    // ✅ Expect skeleton loaders, not "loading" text
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders error state", () => {
    (usePopularMovies as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isFetching: false,
    });
    (useSearchMovies as jest.Mock).mockReturnValue({});

    render(<HomePage />);
    expect(screen.getByText(/failed to fetch movies/i)).toBeInTheDocument();
  });

  it("renders movies grid", () => {
    (usePopularMovies as jest.Mock).mockReturnValue({
      data: mockMovies,
      isLoading: false,
      isError: false,
      isFetching: false,
    });
    (useSearchMovies as jest.Mock).mockReturnValue({});

    render(<HomePage />);
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
  });

  it("switches to search mode when query is entered", async () => {
    (usePopularMovies as jest.Mock).mockReturnValue({});
    (useSearchMovies as jest.Mock).mockReturnValue({
      data: mockMovies,
      isLoading: false,
      isError: false,
      isFetching: false,
    });

    render(<HomePage />);

    fireEvent.change(screen.getByPlaceholderText(/search movies/i), {
      target: { value: "Inception" },
    });

    await waitFor(() => {
      expect(screen.getByText("Inception")).toBeInTheDocument();
    });
  });

  it("renders pagination controls", () => {
    (usePopularMovies as jest.Mock).mockReturnValue({
      data: mockMovies,
      isLoading: false,
      isError: false,
      isFetching: false,
    });
    (useSearchMovies as jest.Mock).mockReturnValue({});

    render(<HomePage />);
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
});
