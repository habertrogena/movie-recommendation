const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function fetchMovieGenres(movieId: number): Promise<string[]> {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`,
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch genres for movie ${movieId}`);
    }

    const data = await res.json();
    return (data.genres || []).map((g: { name: string }) => g.name);
  } catch (err) {
    console.error("TMDB fetchMovieGenres error:", err);
    return ["Uncategorized"];
  }
}
