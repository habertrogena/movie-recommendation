"use client";

import { usePopularMovies } from "@/hooks/usePopularMovies";
import { useSearchMovies } from "@/hooks/useSearchMovies";
import LoadingMovies from "@/components/LoadingMovies";
import ErrorMessage from "@/components/ErrorMessage";
import MovieCard from "@/components/MovieCard";
import PaginationControls from "@/components/PaginationControls";
import { useState } from "react";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const popularQuery = usePopularMovies({ page, enabled: !query });
  const searchQuery = useSearchMovies({ query, page });

  const activeQuery = query ? searchQuery : popularQuery;
  const { data, isLoading, isError, isFetching } = activeQuery;

  if (isLoading) return <LoadingMovies />;
  if (isError) return <ErrorMessage message="Failed to fetch movies." />;

  return (
    <div className="p-4 sm:p-6">
     
      <div className="mb-6 flex justify-center px-2">
        <div className="relative w-full sm:w-3/4 md:w-1/2">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search movies by title or keyword..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

     
      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 p-2 sm:p-4 md:p-6">
        {data?.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </main>

     
      {data && (
        <div className="mt-6 flex justify-center px-2">
          <PaginationControls
            page={data.page}
            totalPages={data.total_pages}
            onPageChange={setPage}
          />
        </div>
      )}

     
      {isFetching && (
        <p className="text-center text-xs sm:text-sm mt-2">Loading page...</p>
      )}
    </div>
  );
}
