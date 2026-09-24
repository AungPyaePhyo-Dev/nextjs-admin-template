import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-4">
      <Skeleton className="h-8 w-60" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
