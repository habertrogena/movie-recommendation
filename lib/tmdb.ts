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

//fetch single movie details
export async function fetchMovieDetails(id: number): Promise<Movie> {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

//search movie
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
