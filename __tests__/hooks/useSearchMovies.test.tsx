import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchMovies } from "@/hooks/useSearchMovies";
import { fetchSearchMovies } from "@/lib/tmdb";

jest.mock("@/lib/tmdb", () => ({
  fetchSearchMovies: jest.fn(),
}));

const createWrapper = (retry = 0) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry,
        retryDelay: () => 0, // instant retries for tests
        staleTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useSearchMovies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns data on success", async () => {
    (fetchSearchMovies as jest.Mock).mockResolvedValueOnce({
      results: [{ title: "Movie 1" }],
    });

    const { result } = renderHook(
      () => useSearchMovies({ query: "star", page: 1 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.results[0].title).toBe("Movie 1");
  });

  it("goes into error state when API fails", async () => {
    (fetchSearchMovies as jest.Mock).mockRejectedValueOnce(
      new Error("API Error"),
    );

    const { result } = renderHook(
      () => useSearchMovies({ query: "fail", page: 1 }),
      { wrapper: createWrapper(0) },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("API Error");
  });

  it("retries twice before succeeding", async () => {
    (fetchSearchMovies as jest.Mock)
      .mockRejectedValueOnce(new Error("Temporary Error"))
      .mockRejectedValueOnce(new Error("Temporary Error"))
      .mockResolvedValueOnce({
        results: [{ title: "Recovered Movie" }],
      });

    const { result } = renderHook(
      () => useSearchMovies({ query: "retry", page: 1 }),
      { wrapper: createWrapper(2) },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.results[0].title).toBe("Recovered Movie");
    expect(fetchSearchMovies).toHaveBeenCalledTimes(3);
  });

  it("does not run when query is empty (enabled=false)", async () => {
    const { result } = renderHook(
      () => useSearchMovies({ query: "", page: 1 }),
      {
        wrapper: createWrapper(),
      },
    );

    // force a microtask flush so the query evaluates enabled=false
    await waitFor(() => {
      expect(result.current.fetchStatus).toBe("idle"); // React Query v5: idle when disabled
    });

    expect(fetchSearchMovies).not.toHaveBeenCalled();
  });

  it("runs when query is provided (enabled=true)", async () => {
    (fetchSearchMovies as jest.Mock).mockResolvedValueOnce({
      results: [{ title: "Movie 1" }],
    });

    const { result } = renderHook(
      () => useSearchMovies({ query: "star", page: 1 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.results[0].title).toBe("Movie 1");
  });

  it("refetches when page changes", async () => {
    (fetchSearchMovies as jest.Mock)
      .mockResolvedValueOnce({ results: [{ title: "Page 1 Movie" }] })
      .mockResolvedValueOnce({ results: [{ title: "Page 2 Movie" }] });

    const { result, rerender } = renderHook(
      ({ page }) => useSearchMovies({ query: "star", page }),
      {
        wrapper: createWrapper(),
        initialProps: { page: 1 },
      },
    );

    await waitFor(() =>
      expect(result.current.data?.results[0].title).toBe("Page 1 Movie"),
    );

    // switch page
    rerender({ page: 2 });

    await waitFor(() =>
      expect(result.current.data?.results[0].title).toBe("Page 2 Movie"),
    );
  });

  it("keeps previous data while fetching next page (placeholderData branch)", async () => {
    (fetchSearchMovies as jest.Mock)
      .mockResolvedValueOnce({ results: [{ title: "Old Page Movie" }] }) // first page
      .mockResolvedValueOnce({ results: [{ title: "New Page Movie" }] }); // second page

    const { result, rerender } = renderHook(
      ({ page }) => useSearchMovies({ query: "star", page }),
      {
        wrapper: createWrapper(),
        initialProps: { page: 1 },
      },
    );

    // wait for first page to load
    await waitFor(() =>
      expect(result.current.data?.results[0].title).toBe("Old Page Movie"),
    );

    // go to page 2 → should keep previous data first
    rerender({ page: 2 });

    // immediately after rerender, placeholderData should still be "Old Page Movie"
    expect(result.current.data?.results[0].title).toBe("Old Page Movie");

    // after fetch resolves, it should switch to new page data
    await waitFor(() =>
      expect(result.current.data?.results[0].title).toBe("New Page Movie"),
    );
  });
});
