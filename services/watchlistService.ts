import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function addMovieToWatchlist(
  uid: string,
  movie: { id: number; title: string },
) {
  //NOTE we use movie.id as document id to avoid duplicates
  const docRef = doc(db, "users", uid, "watchlist", String(movie.id));

  await setDoc(docRef, {
    movieId: movie.id,
    title: movie.title,
    addedAt: serverTimestamp(),
  });
}
