import PaginationControls from "@/components/PaginationControls";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export default function MoviesPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="sticky bottom-0 z-10 bg-slate-200 py-2 mt-4 flex justify-center border-t border-gray-300">
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
