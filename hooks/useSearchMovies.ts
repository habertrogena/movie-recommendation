"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchSearchMovies } from "@/lib/tmdb";
import { TMDBResponse } from "@/types";

interface UseSearchMoviesOptions {
  query: string;
  page?: number;
}

export function useSearchMovies({ query, page = 1 }: UseSearchMoviesOptions) {
  return useQuery<TMDBResponse>({
    queryKey: ["searchMovies", query, page],
    queryFn: () => fetchSearchMovies(query, page),
    enabled: !!query,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}
