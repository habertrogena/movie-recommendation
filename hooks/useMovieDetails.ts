import { fetchMovieDetails } from "@/lib/tmdb";
import { Movie } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useMovieDetails(id: number) {
  return useQuery<Movie>({
    queryKey: ["movieDetails", id],
    queryFn: () => fetchMovieDetails(id),
    enabled: !!id,
  });
}
