import { auth, googleProvider } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";

export const signUpWithEmail = async (email: string, password: string) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  return res.user;
};

export const signInWithEmail = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
};

export const signInWithGoogle = async () => {
  const res = await signInWithPopup(auth, googleProvider);
  return res.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const getCurrentUser = (): User | null => auth.currentUser;
