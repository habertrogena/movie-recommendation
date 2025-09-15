"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import LoadingMovies from "@/components/LoadingMovies";
import ErrorMessage from "@/components/ErrorMessage";

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

        const movies: Movie[] = snapshot.docs.map((doc) => ({
          id: doc.data().id,
          title: doc.data().title,
          poster_path: doc.data().poster_path,
        }));

        setWatchlist(movies);
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        setError("Failed to load watchlist. Please try again.");
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
        doc(db, "users", user.uid, "watchlist", movieId.toString())
      );
    } catch (err) {
      console.error("Error removing movie:", err);
      setError("Could not remove movie. Try again.");
    }
  };

  if (loading || isLoading) return <LoadingMovies />;
  if (error) return <ErrorMessage message={error} />;

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6">
        <h1 className="text-2xl font-bold">Your Watchlist is Empty</h1>
        <p className="mt-2 text-gray-600">
          Add some movies to your watchlist to see them here!
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 My Watchlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {watchlist.map((movie) => (
          <div
            key={movie.id}
            className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
          >
            <h2 className="font-semibold text-lg truncate">{movie.title}</h2>
            <button
              onClick={() => handleRemove(movie.id)}
              className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
