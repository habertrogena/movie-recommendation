import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/tmdb";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} passHref>
      <Card className="shadow-md hover:scale-105 transition-transform cursor-pointer rounded-xl overflow-hidden">
        <CardContent className="p-2 sm:p-3">
         
          {movie.poster_path && (
            <div className="relative w-full h-60 sm:h-72 md:h-80">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                sizes="(max-width: 640px) 100vw,
                       (max-width: 1024px) 50vw,
                       33vw"
                className="object-cover rounded-md"
                priority={false}
              />
            </div>
          )}

         
          <h2 className="mt-2 text-sm sm:text-base md:text-lg font-semibold truncate">
            {movie.title}
          </h2>

         
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
            {movie.overview}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
