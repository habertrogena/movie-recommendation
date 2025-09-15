"use client";

interface AuthButtonsProps {
  onLogin: () => void;
  onSignup: () => void;
}

export default function AuthButtons({ onLogin, onSignup }: AuthButtonsProps) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <button
        onClick={onLogin}
        className="px-4 py-2 border rounded-lg text-sm sm:text-base font-medium hover:bg-gray-100 transition"
      >
        Login
      </button>
      <button
        onClick={onSignup}
        className="px-4 py-2 border rounded-lg text-sm sm:text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Sign Up
      </button>
    </div>
  );
}
