import type { TMDBResponse } from "@/types";

export async function fetchPopularMovies(
  page: number = 1,
): Promise<TMDBResponse> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  return res.json();
}
