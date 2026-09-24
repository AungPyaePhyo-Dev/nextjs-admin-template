import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}
