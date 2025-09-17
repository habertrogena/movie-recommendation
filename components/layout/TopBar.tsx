"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import WatchlistIcon from "@/components/WatchlistIcon";
import { useAuth } from "@/hooks/useAuth";
import { useWatchlistCount } from "@/hooks/useWatchlistcount";
import AuthModals from "@/components/layout/AuthModals";
import ProfileMenu from "../auth/ProfileMenu";

interface TopBarProps {
  query: string;
  setQuery: (q: string) => void;
}

export default function TopBar({ query, setQuery }: TopBarProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const count = useWatchlistCount();
  const { user } = useAuth();
  const router = useRouter();

  const handleWatchlistClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-slate-200 pb-4 mb-6 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center border-b border-gray-300">
      {/* Search */}
      <div className="relative flex-1 w-full max-w-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies by title or keyword..."
          className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base bg-white"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          🔍
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Animated Watchlist Icon */}
        <motion.div
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={handleWatchlistClick}
          className="cursor-pointer"
        >
          <WatchlistIcon count={count} />
        </motion.div>

        {user ? (
          <ProfileMenu user={user} />
        ) : (
          <>
            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 border rounded-lg text-sm sm:text-base font-medium 
                         bg-white text-gray-700 hover:bg-green-100 hover:text-green-700 
                         transition-colors duration-200"
            >
              Login
            </motion.button>

            {/* Sign Up Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSignupOpen(true)}
              className="px-4 py-2 border rounded-lg text-sm sm:text-base font-medium 
                         bg-blue-600 text-white hover:bg-sky-600 hover:shadow-md 
                         transition-colors duration-200"
            >
              Sign Up
            </motion.button>
          </>
        )}
      </div>

      {/* Auth Modals */}
      <AuthModals
        isLoginOpen={isLoginOpen}
        setIsLoginOpen={setIsLoginOpen}
        isSignupOpen={isSignupOpen}
        setIsSignupOpen={setIsSignupOpen}
      />
    </div>
  );
}
