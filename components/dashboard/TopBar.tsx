"use client";

import { useState } from "react";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="open menu"
            className="md:hidden p-2 rounded hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg sm:text-xl font-bold"
        >
          Movie Dashboard
        </motion.h1>
      </div>

      <div className="flex items-center gap-3">
        <motion.input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="hidden sm:block px-3 py-2 border rounded w-40 md:w-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
        <motion.button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 sm:px-4 py-1.5 rounded hover:bg-red-600 text-sm"
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </div>
    </header>
  );
}
