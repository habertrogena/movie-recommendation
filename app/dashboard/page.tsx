"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

import LoadingMovies from "@/components/LoadingMovies";
import ErrorMessage from "@/components/ErrorMessage";
import WatchlistGrid from "@/components/dashboard/WatchlistGrid";
import WatchlistEmpty from "@/components/dashboard/WatchlistEmpty";
import RecommendedMovies from "@/components/dashboard/RecommendedMovies";
import { WatchlistMovie } from "@/services/watchlistService";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);

      try {
        const ref = collection(db, "users", user.uid, "watchlist");
        const snapshot = await getDocs(ref);

        const movies: WatchlistMovie[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: parseInt(d.id, 10),
            title: data.title,
            poster_path: data.poster_path ?? null,
            backdrop_path: data.backdrop_path ?? null,
            release_date: data.release_date ?? "",
            vote_average: data.vote_average ?? 0,
            genres: data.genres ?? [],
          };
        });

        setWatchlist(movies);
      } catch (err) {
        setError(`Failed to load watchlist. Please try again. ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, [user]);

  const handleRemove = async (movieId: number) => {
    if (!user) return;

    // Optimistic update
    setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));

    try {
      await deleteDoc(
        doc(db, "users", user.uid, "watchlist", movieId.toString()),
      );
    } catch (err) {
      setError(`Could not remove movie. Try again. ${err}`);
    }
  };

  if (loading || isLoading) return <LoadingMovies />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="px-4 md:px-8">
      <h3 className="text-3xl font-bold mb-6">🎬 My Watchlist</h3>

      {watchlist.length === 0 ? (
        <WatchlistEmpty />
      ) : (
        <WatchlistGrid movies={watchlist} onRemove={handleRemove} />
      )}

      <div className="mt-12">
        <RecommendedMovies watchlist={watchlist} />
      </div>
    </div>
  );
}
