import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingMovies() {
  return (
    <main className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="shadow-md">
          <CardContent>
            <Skeleton
              data-testid="skeleton"
              className="w-full h-[375px] rounded-md"
            />
            <Skeleton data-testid="skeleton" className="mt-2 h-6 w-3/4" />
            <Skeleton data-testid="skeleton" className="mt-1 h-4 w-full" />
            <Skeleton data-testid="skeleton" className="mt-1 h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
