import {
  fetchPopularMovies,
  fetchMovieDetails,
  fetchSearchMovies,
} from "@/lib/tmdb";

const mockPopularResponse = {
  page: 1,
  results: [{ id: 1, title: "Movie 1" }],
  total_pages: 1,
  total_results: 1,
};

const mockMovieDetails = {
  id: 1,
  title: "Movie 1",
  overview: "Some overview",
  poster_path: "/poster.jpg",
};

const mockSearchResponse = {
  page: 1,
  results: [{ id: 2, title: "Search Movie" }],
  total_pages: 1,
  total_results: 1,
};

describe("TMDB API", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("fetchPopularMovies returns movies on success", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockPopularResponse),
    } as any);

    const data = await fetchPopularMovies(1);
    expect(data).toEqual(mockPopularResponse);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/movie/popular"),
      expect.any(Object),
    );
  });

  it("fetchPopularMovies throws error on failure", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    } as any);

    await expect(fetchPopularMovies(1)).rejects.toThrow(
      "Failed to fetch movies",
    );
  });

  it("fetchMovieDetails returns movie details on success", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockMovieDetails),
    } as any);

    const data = await fetchMovieDetails(1);
    expect(data).toEqual(mockMovieDetails);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/movie/1"));
  });

  it("fetchMovieDetails throws error on failure", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    } as any);

    await expect(fetchMovieDetails(1)).rejects.toThrow(
      "Failed to fetch movie details",
    );
  });

  it("fetchSearchMovies returns search results on success", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockSearchResponse),
    } as any);

    const data = await fetchSearchMovies("test", 1);
    expect(data).toEqual(mockSearchResponse);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/search/movie"),
      expect.any(Object),
    );
  });

  it("fetchSearchMovies throws error on failure", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    } as any);

    await expect(fetchSearchMovies("test", 1)).rejects.toThrow(
      "Failed to search movies",
    );
  });
});
