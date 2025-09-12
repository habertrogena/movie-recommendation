import { fetchSearchMovies } from "@/lib/tmdb";
import type { TMDBResponse } from "@/types";

const mockResponse: TMDBResponse = {
  page: 1,
  results: [{
      id: 1, title: "Inception", overview: "Dream movie",
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
      original_language: ""
  }],
  total_pages: 1,
  total_results: 1,
};

describe("fetchSearchMovies", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fetches movies successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchSearchMovies("Inception", 1);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/search/movie?"),
      { next: { revalidate: 60 } }
    );
    expect(result).toEqual(mockResponse);
  });

  it("encodes query correctly", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchSearchMovies("Spider Man", 2);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("query=Spider%20Man&page=2"),
      expect.any(Object)
    );
  });

  it("throws an error when response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(fetchSearchMovies("FailCase", 1)).rejects.toThrow(
      "Failed to search movies"
    );
  });
});
