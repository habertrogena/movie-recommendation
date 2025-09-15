import Image from "next/image";
import { Genre, Movie } from "@/types/tmdb";

interface MovieInfoProps {
  movie: Movie;
  onAdd: () => void;
  isAdding: boolean;
}

export default function MovieInfo({ movie, onAdd, isAdding }: MovieInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {movie.poster_path && (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={500}
          height={750}
          className="rounded-md mx-auto"
        />
      )}

      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold">{movie.title}</h1>
        {movie.tagline && (
          <p className="italic text-gray-500">{movie.tagline}</p>
        )}

        <p className="mt-2 text-gray-600">Release Date: {movie.release_date}</p>
        <p className="mt-2 text-yellow-500 font-semibold">
          Rating: {movie.vote_average}
        </p>

        {movie.runtime && (
          <p className="mt-2">Runtime: {movie.runtime} minutes</p>
        )}

        {movie.genres && movie.genres.length > 0 && (
          <p className="mt-2">
            Genres: {movie.genres.map((g: Genre) => g.name).join(", ")}
          </p>
        )}

        <p className="mt-4 text-gray-700">{movie.overview}</p>

        <div className="mt-6">
          <button
            onClick={onAdd}
            disabled={isAdding}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isAdding ? "Adding..." : "Add to Watchlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
