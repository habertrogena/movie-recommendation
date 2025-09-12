import { renderHook, waitFor } from "@testing-library/react";
import { usePopularMovies } from "@/hooks/usePopularMovies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock API
jest.mock("@/lib/tmdb", () => ({
  fetchPopularMovies: jest.fn(() =>
    Promise.resolve({
      page: 1,
      results: [
        {
          id: 1,
          title: "Inception",
          overview: "Test movie",
          poster_path: null,
        },
      ],
      total_pages: 1,
      total_results: 1,
    }),
  ),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe("usePopularMovies", () => {
  it("fetches and returns movies", async () => {
    const { result } = renderHook(() => usePopularMovies({ page: 1 }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data?.results[0].title).toBe("Inception");
  });
});
