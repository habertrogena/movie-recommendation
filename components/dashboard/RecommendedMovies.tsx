"use client";

import { useRecommendedMovies } from "@/hooks/useRecommendedMovies";
import MovieCard from "../MovieCard";
import LoadingMovies from "../LoadingMovies";
import { WatchlistMovie } from "@/services/watchlistService";
import { Movie } from "@/types";

/**
 * Map a WatchlistMovie (from Firestore) to TMDB Movie type for MovieCard
 */
function mapWatchlistMovieToMovie(movie: WatchlistMovie): Movie {
  return {
    id: movie.id,
    title: movie.title,
    original_title: movie.title,
    overview: "",
    poster_path: movie.poster_path ?? null,
    backdrop_path: movie.backdrop_path ?? null,
    release_date: movie.release_date ?? "",
    vote_average: movie.vote_average ?? 0,
    vote_count: 0,
    popularity: 0,
    adult: false,
    video: false,
    genre_ids: movie.genres.map((g) => g.id),
    original_language: "en",
  };
}

export default function RecommendedMovies({
  watchlist,
}: {
  watchlist: WatchlistMovie[];
}) {
  const {
    data: recommendations,
    isLoading,
    isError,
  } = useRecommendedMovies(watchlist);

  if (isLoading) return <LoadingMovies />;
  if (isError) return <p>Failed to load recommendations.</p>;
  if (!recommendations || recommendations.length === 0)
    return <p>No recommendations yet.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recommendations.map((movie) => (
          <MovieCard key={movie.id} movie={mapWatchlistMovieToMovie(movie)} />
        ))}
      </div>
    </div>
  );
}
