import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-20 pt-12 sm:px-6">
      <div className="panel tone-border p-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-8 w-1/2" />
        <Skeleton className="mt-3 h-4 w-3/4" />
        <Skeleton className="mt-8 h-24 w-full" />
      </div>
    </div>
  );
}
