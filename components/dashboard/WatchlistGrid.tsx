"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Movie {
  id: number;
  title: string;
}

export default function WatchlistGrid({
  movies,
  onRemove,
}: {
  movies: Movie[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <AnimatePresence>
        {movies.map((movie) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
          >
            <h2 className="font-semibold text-lg truncate">{movie.title}</h2>
            <button
              onClick={() => onRemove(movie.id)}
              className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Remove
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
