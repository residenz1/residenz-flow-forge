import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface SkeletonCardProps {
  variant?: "default" | "visit" | "resi" | "stats";
}

export const SkeletonCard = ({ variant = "default" }: SkeletonCardProps) => {
  if (variant === "stats") {
    return (
      <Card className="p-4">
        <Skeleton className="h-8 w-12 mx-auto mb-2" />
        <Skeleton className="h-3 w-16 mx-auto" />
      </Card>
    );
  }

  if (variant === "resi") {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (variant === "visit") {
    return (
      <Card className="p-6">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-6 w-48 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex gap-3 mt-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </Card>
  );
};
