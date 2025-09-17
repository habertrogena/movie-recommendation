"use client";

import { useState } from "react";
import { usePopularMovies } from "@/hooks/usePopularMovies";
import { useSearchMovies } from "@/hooks/useSearchMovies";
import LoadingMovies from "@/components/LoadingMovies";
import ErrorMessage from "@/components/ErrorMessage";
import TopBar from "@/components/layout/TopBar";
import MoviesGrid from "@/components/movies/MoviesGrid";
import MoviesPagination from "@/components/movies/MoviesPagination";
import NoResultsFound from "@/components/NoResultsFound";

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
    <div className="min-h-screen bg-slate-200">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <TopBar
          query={query}
          setQuery={(q) => {
            setQuery(q);
            setPage(1);
          }}
        />
        {query && data?.results?.length === 0 && (
          <NoResultsFound query={query} />
        )}
        
        {data && <MoviesGrid movies={data.results} />}

        {data && (
          <MoviesPagination
            page={data.page}
            totalPages={data.total_pages}
            onPageChange={setPage}
          />
        )}

        {isFetching && <LoadingMovies />}
      </div>
    </div>
  );
}
