import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export interface CategoryCount {
  id: string;
  name: string;
  count: number;
}

interface WatchlistDoc {
  genres?: { id: number; name: string }[];
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
      const genres = data.genres || [{ id: 0, name: "Uncategorized" }];

      genres.forEach((g) => {
        const name = g.name;
        categoryMap[name] = (categoryMap[name] || 0) + 1;
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
