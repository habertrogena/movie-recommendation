import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import * as tmdb from "@/lib/tmdb";

jest.mock("@/lib/tmdb", () => ({
  fetchMovieDetails: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useMovieDetails", () => {
  it("returns movie data on success", async () => {
    (tmdb.fetchMovieDetails as jest.Mock).mockResolvedValueOnce({
      id: 1,
      title: "Inception",
    });

    const { result } = renderHook(() => useMovieDetails(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ id: 1, title: "Inception" });
  });

  it("does not run query if id is falsy", async () => {
    const { result } = renderHook(() => useMovieDetails(0), {
      wrapper: createWrapper(),
    });

    expect(result.current.status).toBe("pending");
    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });
});
