"use client";

import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Menu, Home } from "lucide-react";
import { motion } from "framer-motion";

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
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

        <motion.button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
          whileTap={{ scale: 0.95 }}
        >
          <Home className="w-4 h-4" />
          Home
        </motion.button>
      </div>

      <div className="flex items-center gap-3">
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
