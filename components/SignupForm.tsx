"use client";

import { useState } from "react";
import { signupWithEmail, loginWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signupWithEmail(email, password);
      alert("✅ Account created successfully! Movie added to watchlist.");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      alert("✅ Account created successfully! Movie added to watchlist.");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleEmailSignup} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleGoogleSignup}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
