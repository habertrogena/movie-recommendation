import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { fetchMovieGenres } from "./tmdbService";

export interface WatchlistMovie {
  id: number;
  title: string;
  poster_path?: string;
  genres?: string[];
}

export async function addMovieToWatchlist(
  userId: string,
  movie: WatchlistMovie,
): Promise<boolean> {
  try {
    const ref = doc(db, "users", userId, "watchlist", movie.id.toString());

    const genres = await fetchMovieGenres(movie.id);
    const movieData: WatchlistMovie = {
      ...movie,
      genres: genres.length > 0 ? genres : ["Uncategorized"],
    };

    await setDoc(ref, movieData, { merge: true });
    return true;
  } catch (err) {
    console.error("Failed to add movie to watchlist:", err);
    return false;
  }
}
