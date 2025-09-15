export default function FloatingToast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
      {message}
    </div>
  );
}
