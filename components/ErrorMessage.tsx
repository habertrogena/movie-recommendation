interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({
  message = "Something went wrong.",
}: ErrorMessageProps) {
  return (
    <p className="text-center mt-10 text-red-500 font-semibold">{message}</p>
  );
}
