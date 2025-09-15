"use client";

import ErrorMessage from "@/components/ErrorMessage";
import LoadingMovies from "@/components/LoadingMovies";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

import FloatingToast from "@/components/FloatingToast";
import Modal from "@/components/Modal";
import SignupModal from "@/components/SignupModal";

import { useWatchlist } from "@/hooks/useWatchlist";
import MovieInfo from "@/components/movies/MovieInfo";

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const { data: movie, isLoading, isError } = useMovieDetails(id);
  const { user, loading: authLoading } = useAuth();

  const [showPromptModal, setShowPromptModal] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const { isAdding, toastMessage, handleAddToWatchlist } = useWatchlist(
    user,
    movie,
  );

  const handleClickAdd = async () => {
    if (authLoading) return;
    if (!user) {
      setShowPromptModal(true);
      return;
    }
    await handleAddToWatchlist();
  };

  const onSignedUp = async (signedUser: any) => {
    if (signedUser && movie) {
      await handleAddToWatchlist();
    }
    setShowPromptModal(false);
    setIsSignupOpen(false);
  };

  if (isLoading) return <LoadingMovies />;
  if (isError) return <ErrorMessage message="Failed to load movie details." />;

  return (
    <main className="p-6 relative min-h-[60vh]">
      <FloatingToast message={toastMessage ?? ""} />

      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Back to Movies
      </button>

      {movie && (
        <MovieInfo movie={movie} onAdd={handleClickAdd} isAdding={isAdding} />
      )}

      <Modal isOpen={showPromptModal} onClose={() => setShowPromptModal(false)}>
        <h3 className="text-lg font-semibold mb-2">Create an account</h3>
        <p className="text-sm text-gray-700 mb-4">
          For you to add movie to watchlist you need to create an account first.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setIsSignupOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Proceed
          </button>
          <button
            onClick={() => setShowPromptModal(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSignedUp={onSignedUp}
      />
    </main>
  );
}
