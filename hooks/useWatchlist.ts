import { useState } from "react";
import { addMovieToWatchlist } from "@/services/watchlistService";
import { User } from "firebase/auth";
import { Movie } from "@/types";
import { GENRE_MAP } from "@/constants/genres";

export function useWatchlist(user: User | null, movie?: Movie) {
  const [isAdding, setIsAdding] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string, ms = 2000) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), ms);
  };

  const handleAddToWatchlist = async () => {
    if (!user || !movie) return false;

    setIsAdding(true);
    try {
      const genres =
        movie.genre_ids?.map((id) => ({
          id,
          name: GENRE_MAP[id] || "Unknown",
        })) ||
        movie.genres ||
        [];

      await addMovieToWatchlist(user.uid, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genres,
      });

      showToast(`${movie.title} added to your watchlist ✅`);
      return true;
    } catch (err) {
      console.error(err);
      showToast("Failed to add to watchlist. Try again.");
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  return {
    isAdding,
    toastMessage,
    handleAddToWatchlist,
  };
}
