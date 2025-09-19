import { useState, useEffect } from "react";
import { User } from "firebase/auth";

import { Movie } from "@/types";
import { getUserWatchlist } from "@/services/watchlistService";

export function useUserWatchlist(user: User | null) {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchWatchlist = async () => {
      try {
        const data = await getUserWatchlist(user.uid);
        setWatchlist(data);
      } catch (err) {
        console.error("Failed to fetch watchlist", err);
      }
    };

    fetchWatchlist();
  }, [user]);

  return { watchlist };
}
