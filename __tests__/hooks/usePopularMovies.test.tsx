import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePopularMovies } from "@/hooks/usePopularMovies";
import { fetchPopularMovies } from "@/lib/tmdb";

// mock the API function
jest.mock("@/lib/tmdb", () => ({
  fetchPopularMovies: jest.fn(),
}));

// wrapper for hooks
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0, // don’t cache between tests
        retryDelay: () => 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePopularMovies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns data on success", async () => {
    (fetchPopularMovies as jest.Mock).mockResolvedValueOnce({
      results: [{ title: "Movie 1" }],
    });

    const { result } = renderHook(
      () => usePopularMovies({ page: 1, retry: 0 }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.results[0].title).toBe("Movie 1");
  });

  it("goes into error state when API fails", async () => {
    (fetchPopularMovies as jest.Mock).mockRejectedValueOnce(
      new Error("API Error"),
    );

    const { result } = renderHook(
      () => usePopularMovies({ page: 1, retry: 0 }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("API Error");
  });

  it("retries twice before succeeding", async () => {
    (fetchPopularMovies as jest.Mock)
      .mockRejectedValueOnce(new Error("Temporary Error")) // 1st fail
      .mockRejectedValueOnce(new Error("Temporary Error")) // 2nd fail
      .mockResolvedValueOnce({
        results: [{ title: "Recovered Movie" }], // 3rd success
      });

    const { result } = renderHook(
      () => usePopularMovies({ page: 1, retry: 2 }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchPopularMovies).toHaveBeenCalledTimes(3);
    expect(result.current.data?.results[0].title).toBe("Recovered Movie");
  });

  it("does not fetch when enabled is false", async () => {
    const { result } = renderHook(
      () => usePopularMovies({ page: 1, enabled: false }),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current.fetchStatus).toBe("idle"); // query never runs
    expect(fetchPopularMovies).not.toHaveBeenCalled();
  });

  it("respects custom retry option", async () => {
    (fetchPopularMovies as jest.Mock).mockRejectedValue(new Error("Fail"));

    const { result } = renderHook(
      () => usePopularMovies({ page: 1, enabled: true, retry: 0 }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(fetchPopularMovies).toHaveBeenCalledTimes(1); // no retries
  });

  it("refetches when page changes", async () => {
    (fetchPopularMovies as jest.Mock)
      .mockResolvedValueOnce({ results: [{ title: "Page 1 Movie" }] })
      .mockResolvedValueOnce({ results: [{ title: "Page 2 Movie" }] });

    const { result, rerender } = renderHook(
      ({ page }) => usePopularMovies({ page }),
      {
        wrapper: createWrapper(),
        initialProps: { page: 1 },
      },
    );

    // First load
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.results[0].title).toBe("Page 1 Movie");
    });

    // Change page
    rerender({ page: 2 });

    // Wait until it fetches and succeeds again
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.results[0].title).toBe("Page 2 Movie");
    });
  });
});
