"use client";


import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import Modal from "../ui/Modal";

interface Props {
  isLoginOpen: boolean;
  setIsLoginOpen: (b: boolean) => void;
  isSignupOpen: boolean;
  setIsSignupOpen: (b: boolean) => void;
}

export default function AuthModals({
  isLoginOpen,
  setIsLoginOpen,
  isSignupOpen,
  setIsSignupOpen,
}: Props) {
  return (
    <>
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Login</h2>
        <LoginForm />
      </Modal>

      <Modal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Sign Up</h2>
        <SignupForm />
      </Modal>
    </>
  );
}
