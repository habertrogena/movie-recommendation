import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { Movie } from "@/types/tmdb";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="shadow-md">
      <CardContent>
        {movie.poster_path && (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={750}
            className="rounded-md"
          />
        )}
        <h2 className="mt-2 text-lg font-semibold">{movie.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-3">{movie.overview}</p>
      </CardContent>
    </Card>
  );
}
