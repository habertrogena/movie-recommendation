"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPopularMovies } from "@/lib/tmdb";
import { TMDBResponse } from "@/types";

interface UsePopularMoviesOptions {
  page?: number;
  enabled?: boolean;
  retry?: number | boolean;
}

export function usePopularMovies({
  page = 1,
  enabled = true,
  retry = 2,
}: UsePopularMoviesOptions = {}) {
  return useQuery<TMDBResponse>({
    queryKey: ["popularMovies", page],
    queryFn: () => fetchPopularMovies(page),
    staleTime: 1000 * 60 * 5,
    retry,
    retryDelay: () => 0,
    enabled,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
}
