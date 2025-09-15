"use client";

import Modal from "./Modal";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSignedUp: (user: User) => void; // callback when signup/signin succeeded
}

export default function SignupModal({ isOpen, onClose, onSignedUp }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (username && cred.user) {
        await updateProfile(cred.user, { displayName: username });
      }
      onSignedUp(cred.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      onSignedUp(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-3">Create an account</h3>

      {error && (
        <div className="mb-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailSignup} className="flex flex-col gap-2">
        <input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border px-3 py-2 rounded"
        />
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="border px-3 py-2 rounded"
        />
        <input
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={busy}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {busy ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="mt-3 text-center">
        <span className="text-sm text-gray-500">or</span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleGoogle}
          disabled={busy}
          className="w-full border px-3 py-2 rounded hover:bg-gray-50"
        >
          Continue with Google
        </button>
      </div>
    </Modal>
  );
}
