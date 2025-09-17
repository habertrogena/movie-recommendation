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

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Fetch watchlist movies
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);

      try {
        const ref = collection(db, "users", user.uid, "watchlist");
        const snapshot = await getDocs(ref);

        const movies: Movie[] = snapshot.docs.map((d) => ({
          id: parseInt(d.id, 10), // use Firestore doc ID
          ...(d.data() as Omit<Movie, "id">),
        }));

        setWatchlist(movies);
      } catch (err) {
        setError(`Failed to load watchlist. Please try again.${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();
  }, [user]);

  // Remove movie from watchlist
  const handleRemove = async (movieId: number) => {
    if (!user) return;

    // Optimistic update
    setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));

    try {
      await deleteDoc(
        doc(db, "users", user.uid, "watchlist", movieId.toString()),
      );
    } catch (err) {
      setError(`Could not remove movie. Try again.${err}`);
    }
  };

  if (loading || isLoading) return <LoadingMovies />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">🎬 My Watchlist</h1>

      {watchlist.length === 0 ? (
        <WatchlistEmpty />
      ) : (
        <WatchlistGrid movies={watchlist} onRemove={handleRemove} />
      )}
    </>
  );
}
