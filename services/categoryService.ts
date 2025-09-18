import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export interface CategoryCount {
  id: string;
  name: string;
  count: number;
}

interface WatchlistDoc {
  genres?: string[];
}

export async function getUserCategories(
  userId: string,
): Promise<CategoryCount[]> {
  try {
    const ref = collection(db, "users", userId, "watchlist");
    const snapshot = await getDocs(ref);

    const categoryMap: Record<string, number> = {};

    snapshot.forEach((doc) => {
      const data = doc.data() as WatchlistDoc;
      const genres: string[] = data.genres || ["Uncategorized"];

      genres.forEach((g) => {
        categoryMap[g] = (categoryMap[g] || 0) + 1;
      });
    });

    return Object.entries(categoryMap).map(([name, count]) => ({
      id: name.toLowerCase(),
      name,
      count,
    }));
  } catch (err) {
    console.error("Failed to fetch user categories:", err);
    return [];
  }
}
