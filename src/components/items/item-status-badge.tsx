import type { ItemStatus } from '@/types';
import { cn } from '@/lib/utils';

const STYLES: Record<ItemStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  DRAFT: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  ARCHIVED: 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
};

export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center h-6 px-2.5 rounded-md text-[11px] font-semibold tracking-wide',
        STYLES[status],
      )}
    >
      {status}
    </span>
  );
}
