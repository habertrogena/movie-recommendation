import { renderHook, act } from "@testing-library/react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { addMovieToWatchlist } from "@/services/watchlistService";

jest.mock("@/services/watchlistService", () => ({
  addMovieToWatchlist: jest.fn(),
}));

describe("useWatchlist", () => {
  const user = { uid: "123", email: "test@example.com" } as any;
  const movie = { id: 1, title: "Inception" };

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

    // trigger adding
    await act(async () => {
      await result.current.handleAddToWatchlist();
    });

    expect(result.current.toastMessage).toMatch(/added to your watchlist/);

    // ⏰ advance timers INSIDE act()
    await act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.toastMessage).toBeNull();
  });
});
