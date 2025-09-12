"use client";

import { useMediaQuery } from "react-responsive";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page (disabled)
      pages.push(1);

      if (page > 3) pages.push("...");

      // Show only nearby pages
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push("...");

      // Always show last page (disabled)
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center gap-2 mt-6 items-center flex-wrap">
     
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>

      {isMobile ? (
        <span className="px-2 py-1">
          Page {page} / {totalPages}
        </span>
      ) : (
        <div className="flex gap-1">
          {generatePageNumbers().map((p, i) =>
            typeof p === "number" ? (
              <button
                key={i}
                onClick={() => {
                  if (p !== 1 && p !== totalPages) {
                    onPageChange(p);
                  }
                }}
                disabled={p === 1 || p === totalPages}
                className={`px-3 py-1 rounded ${
                  p === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 disabled:opacity-50"
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={i} className="px-2 py-1">
                {p}
              </span>
            )
          )}
        </div>
      )}

      
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
