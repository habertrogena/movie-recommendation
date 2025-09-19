import { renderHook, act } from "@testing-library/react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { addMovieToWatchlist } from "@/services/watchlistService";
import { User } from "firebase/auth";

jest.mock("@/services/watchlistService", () => ({
  addMovieToWatchlist: jest.fn(),
}));

describe("useWatchlist", () => {
  const user = {
    uid: "123",
    email: "test@example.com",
  } as Partial<User> as User;

  const movie = {
    id: 1,
    title: "Inception",
    original_title: "Inception",
    overview: "A mind-bending thriller",
    poster_path: "/poster.jpg",
    backdrop_path: "/backdrop.jpg",
    release_date: "2010-07-16",
    vote_average: 8.8,
    vote_count: 21000,
    adult: false,
    video: false,
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Sci-Fi" },
    ],
    genre_ids: [28, 878],
    original_language: "en",
    runtime: 148,
    tagline: "Your mind is the scene of the crime",
    popularity: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("adds movie to watchlist successfully and clears toast after 2s", async () => {
    (addMovieToWatchlist as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useWatchlist(user, movie));

    await act(async () => {
      await result.current.handleAddToWatchlist();
    });

    // Check toast message immediately
    expect(result.current.toastMessage).toBe(
      "Inception added to your watchlist ✅",
    );

    // Advance timers to clear toast
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.toastMessage).toBeNull();
  });

  it("handles errors when adding a movie fails", async () => {
    (addMovieToWatchlist as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useWatchlist(user, movie));

    await act(async () => {
      await result.current.handleAddToWatchlist();
    });

    // The hook sets a fixed toast message on error
    expect(result.current.toastMessage).toBe(
      "Failed to add to watchlist. Try again.",
    );

    // Advance timers to clear toast
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.toastMessage).toBeNull();
  });
});
