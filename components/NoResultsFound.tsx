
export default function NoResultsFound({ query }: { query: string }) {
  return (
    <div className="text-center py-10 text-gray-700">
      No results found for "{query}".
    </div>
  );
}
