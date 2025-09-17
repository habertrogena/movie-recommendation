"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserCategories, CategoryCount } from "@/services/categoryService";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const cats = await getUserCategories(user.uid);
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>

      {user && (
        <div className="mb-6">
          <p className="font-semibold">👤 {user.email}</p>
        </div>
      )}

      <nav className="flex-1 space-y-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="block w-full text-left px-3 py-2 rounded hover:bg-slate-200"
        >
          🎬 Watchlist
        </button>

        <div>
          <h3 className="text-sm font-semibold mb-2">Categories</h3>
          <ul className="space-y-1">
            {loading ? (
              <li className="text-sm text-gray-400">Loading...</li>
            ) : categories.length > 0 ? (
              categories.map((c) => (
                <li
                  key={c.id}
                  className="flex justify-between text-sm px-3 py-1 hover:bg-slate-100 rounded cursor-pointer"
                >
                  <span>{c.name}</span>
                  <span className="text-gray-500">{c.count}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-400">No categories yet</li>
            )}
          </ul>
        </div>
      </nav>

      <button
        onClick={logout}
        className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </aside>
  );
}
