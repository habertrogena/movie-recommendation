import MovieCard from "@/components/MovieCard";
import type { Movie } from "@/types/tmdb";

export default function MoviesGrid({ movies }: { movies: Movie[] }) {
  return (
    <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </main>
  );
}
