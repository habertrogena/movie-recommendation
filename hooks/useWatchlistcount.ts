"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export function useWatchlistCount() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setCount(0);
      return;
    }

    const watchlistRef = collection(db, "users", user.uid, "watchlist");

    const unsubscribe = onSnapshot(watchlistRef, (snapshot) => {
      setCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  return count;
}
