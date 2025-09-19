import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Movie } from "@/types";
import { fetchMovieGenres, Genre } from "./tmdbService";

export interface WatchlistMovie {
  id: number;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  genres: Genre[];
}

export async function addMovieToWatchlist(
  userId: string,
  movie: WatchlistMovie,
): Promise<boolean> {
  try {
    const ref = doc(db, "users", userId, "watchlist", movie.id.toString());

    // Use existing genres if available, otherwise fetch from TMDB
    const genres: Genre[] =
      movie.genres && movie.genres.length > 0
        ? movie.genres
        : await fetchMovieGenres(movie.id);

    const movieData: WatchlistMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path ?? null,
      backdrop_path: movie.backdrop_path ?? null,
      release_date: movie.release_date ?? "",
      vote_average: movie.vote_average ?? 0,
      genres,
    };

    await setDoc(ref, movieData, { merge: true });
    return true;
  } catch (err) {
    console.error("Failed to add movie to watchlist:", err);
    return false;
  }
}

export async function getUserWatchlist(userId: string): Promise<Movie[]> {
  const watchlistRef = doc(db, "watchlists", userId);
  const watchlistSnap = await getDoc(watchlistRef);

  if (!watchlistSnap.exists()) return [];
  const data = watchlistSnap.data();
  return data.movies || [];
}
