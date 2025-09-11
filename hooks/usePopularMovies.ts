"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPopularMovies } from "@/lib/tmdb";
import { TMDBResponse } from "@/types";

interface UsePopularMoviesOptions {
  page?: number;
  enabled?: boolean;
}

export function usePopularMovies({ page = 1 }: UsePopularMoviesOptions = {}) {
  return useQuery<TMDBResponse>({
    queryKey: ["popularMovies", page],
    queryFn: () => fetchPopularMovies(page),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData:keepPreviousData,
  });
}
