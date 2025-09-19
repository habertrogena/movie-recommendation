"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchRecommendedMovies } from "@/lib/tmdb";
import { WatchlistMovie } from "@/services/watchlistService";

export function useRecommendedMovies(watchlist: WatchlistMovie[]) {
  const genreIds = watchlist.flatMap((movie) => movie.genres.map((g) => g.id));
  const watchlistIds = watchlist.map((movie) => movie.id);

  const query = useQuery<WatchlistMovie[]>({
    queryKey: ["recommendedMovies", watchlistIds],
    queryFn: () => fetchRecommendedMovies([...new Set(genreIds)], watchlistIds),
    enabled: watchlist.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
