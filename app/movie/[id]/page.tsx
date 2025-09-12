"use client";

import ErrorMessage from "@/components/ErrorMessage";
import LoadingMovies from "@/components/LoadingMovies";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const { data: movie, isLoading, isError } = useMovieDetails(id);

  if (isLoading) return <LoadingMovies />;
  if (isError) return <ErrorMessage message="Failed to load movie details." />;

  return (
    <main className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back to Movies
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {movie?.poster_path && (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={750}
            className="rounded-md mx-auto"
          />
        )}

        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold">{movie?.title}</h1>
          {movie?.tagline && (
            <p className="italic text-gray-500">{movie.tagline}</p>
          )}

          <p className="mt-2 text-gray-600">
            Release Date: {movie?.release_date}
          </p>
          <p className="mt-2 text-yellow-500 font-semibold">
            Rating: {movie?.vote_average}
          </p>
          {movie?.runtime && (
            <p className="mt-2">Runtime: {movie.runtime} minutes</p>
          )}

          {movie?.genres && movie.genres.length > 0 && (
            <p className="mt-2">
              Genres: {movie.genres.map((g) => g.name).join(", ")}
            </p>
          )}

          <p className="mt-4 text-gray-700">{movie?.overview}</p>
        </div>
      </div>
    </main>
  );
}
