"use client";

import { useRouter } from "next/navigation";

export default function WatchlistEmpty() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">Your Watchlist is Empty</h1>
      <p className="mt-2 text-gray-600">
        Add some movies to your watchlist to see them here!
      </p>
      <button
        onClick={() => router.push("/")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Back to Home
      </button>
    </div>
  );
}
