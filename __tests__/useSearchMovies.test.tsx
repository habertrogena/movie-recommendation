import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchMovies } from "@/hooks/useSearchMovies";
import { fetchSearchMovies } from "@/lib/tmdb";
import type { TMDBResponse } from "@/types";

// mock the API function
jest.mock("@/lib/tmdb", () => ({
  fetchSearchMovies: jest.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useSearchMovies", () => {
  it("fetches movies when query is provided", async () => {
    const mockResponse: TMDBResponse = {
      page: 1,
      results: [
        {
          id: 1,
          title: "Inception",
          overview: "Dream movie",
          original_title: "",
          poster_path: null,
          backdrop_path: null,
          release_date: "",
          vote_average: 0,
          vote_count: 0,
          popularity: 0,
          adult: false,
          video: false,
          genre_ids: [],
          original_language: "",
        },
      ],
      total_pages: 1,
      total_results: 1,
    };

    (fetchSearchMovies as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(
      () => useSearchMovies({ query: "Inception", page: 1 }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponse);
  });

  it("does not run when query is empty", async () => {
    const { result } = renderHook(
      () => useSearchMovies({ query: "", page: 1 }),
      { wrapper: createWrapper() },
    );

    // query should not run
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
