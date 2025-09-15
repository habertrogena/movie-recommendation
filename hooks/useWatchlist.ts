import { useState } from "react";
import { addMovieToWatchlist } from "@/services/watchlistService";
import { User } from "firebase/auth"; 

export function useWatchlist(
  user: User | null,
  movie?: { id: number; title: string }
) {
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
      await addMovieToWatchlist(user.uid, {
        id: movie.id,
        title: movie.title,
      });
      showToast(`${movie.title} added to your watchlist ✅`);
      return true;
    } catch (err) {
      
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
