"use client";

interface WatchlistIconProps {
  count: number;
  onClick?: () => void;
}

export default function WatchlistIcon({ count, onClick }: WatchlistIconProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-100"
    >
      <span>📽️</span>
      <span className="text-sm">Watchlist</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}
