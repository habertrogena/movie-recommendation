"use client";

import { usePopularMovies } from "@/hooks/usePopularMovies";
import LoadingMovies from "@/components/LoadingMovies";
import ErrorMessage from "@/components/ErrorMessage";
import MovieCard from "@/components/MovieCard";
import { useState } from "react";
import PaginationControls from "@/components/PaginationControls";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = usePopularMovies({ page });

  if (isLoading) return <LoadingMovies />;
  if (isError) return <ErrorMessage message="Failed to fetch movies." />;

  return (
    <div>
      <main className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
        {data?.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </main>

      {data && (
        <PaginationControls
          page={data.page}
          totalPages={data.total_pages}
          onPageChange={setPage}
        />
      )}

      {isFetching && (
        <p className="text-center text-sm mt-2">Loading page...</p>
      )}
    </div>
  );
}
