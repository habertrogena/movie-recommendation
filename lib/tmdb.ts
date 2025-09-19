import { WatchlistMovie } from "@/services/watchlistService";
import type { Movie, TMDBResponse } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchPopularMovies(
  page: number = 1,
): Promise<TMDBResponse> {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  return res.json();
}

export async function fetchMovieDetails(id: number): Promise<Movie> {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export async function fetchSearchMovies(
  query: string,
  page: number = 1,
): Promise<TMDBResponse> {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) throw new Error("Failed to search movies");
  return res.json();
}

export async function fetchRecommendedMovies(
  genreIds: number[],
  excludedMovieIds: number[],
  limit = 10,
): Promise<WatchlistMovie[]> {
  if (genreIds.length === 0) return [];

  const pagesToFetch = [1, 2, 3];
  const allMovies: Movie[] = [];

  for (const page of pagesToFetch) {
    const data: TMDBResponse = await fetchPopularMovies(page);
    allMovies.push(...data.results);
  }

  // Filter movies: include at least one genre from watchlist & not in watchlist
  const filtered = allMovies.filter(
    (movie) =>
      movie.genre_ids.some((id) => genreIds.includes(id)) &&
      !excludedMovieIds.includes(movie.id),
  );

  const mapped: WatchlistMovie[] = filtered.map((movie) => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ?? null,
    backdrop_path: movie.backdrop_path ?? null,
    release_date: movie.release_date ?? "",
    vote_average: movie.vote_average ?? 0,
    genres:
      movie.genres && movie.genres.length > 0
        ? movie.genres
        : movie.genre_ids.map((id) => ({ id, name: "Unknown" })), // fallback
  }));

  return mapped
    .sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
    .slice(0, limit);
}

export async function fetchMovieGenres(
  movieId: number,
): Promise<{ id: number; name: string }[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=YOUR_KEY`,
  );
  const data = await res.json();
  return data.genres ?? [];
}
