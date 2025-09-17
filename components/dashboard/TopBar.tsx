"use client";

import { useState } from "react";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between bg-white shadow p-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search movies..."
        className="px-3 py-2 border rounded w-1/2"
      />
      <button onClick={handleLogout} className="text-red-600 hover:underline">
        Logout
      </button>
    </header>
  );
}
