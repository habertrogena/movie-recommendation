import { render, screen, fireEvent } from "@testing-library/react";
import MovieDetailsPage from "@/app/movie/movieDetailsPage";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

jest.mock("@/hooks/useMovieDetails");
jest.mock("@/hooks/useAuth"); // ✅ mock auth
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe("MovieDetailsPage", () => {
  const mockUseMovieDetails = useMovieDetails as jest.Mock;
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseParams = useParams as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // ✅ always return a fake user to avoid undefined errors
    mockUseAuth.mockReturnValue({
      user: { uid: "test-user", email: "test@example.com" },
      loading: false,
      logout: jest.fn(),
    });

    mockUseParams.mockReturnValue({ id: "1" });
    mockUseRouter.mockReturnValue({ back: jest.fn() });
  });

  it("renders loading state", () => {
    mockUseMovieDetails.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<MovieDetailsPage />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders error state", () => {
    mockUseMovieDetails.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(<MovieDetailsPage />);
    expect(
      screen.getByText(/Failed to load movie details/i)
    ).toBeInTheDocument();
  });

  it("renders movie details when data is available", () => {
    mockUseMovieDetails.mockReturnValue({
      data: {
        id: 1,
        title: "Inception",
        poster_path: "/inception.jpg",
        release_date: "2010-07-16",
        vote_average: 8.8,
        overview: "A thief who steals corporate secrets through dream-sharing.",
      },
      isLoading: false,
      isError: false,
    });

    render(<MovieDetailsPage />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText(/Release Date:\s*2010-07-16/)).toBeInTheDocument();
    expect(screen.getByText(/Rating: 8.8/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A thief who steals corporate secrets/i)
    ).toBeInTheDocument();
  });

  it("navigates back when back button is clicked", () => {
    const backMock = jest.fn();
    mockUseRouter.mockReturnValue({ back: backMock });

    mockUseMovieDetails.mockReturnValue({
      data: {
        id: 1,
        title: "Inception",
        poster_path: "/inception.jpg",
        release_date: "2010-07-16",
        vote_average: 8.8,
        overview: "Some overview",
      },
      isLoading: false,
      isError: false,
    });

    render(<MovieDetailsPage />);
    fireEvent.click(screen.getByText(/← Back to Movies/i));
    expect(backMock).toHaveBeenCalled();
  });
});
