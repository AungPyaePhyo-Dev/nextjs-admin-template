import type { Role } from '@/types';
import { cn } from '@/lib/utils';

const STYLES: Record<Role, string> = {
  ADMIN: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  EDITOR: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  VIEWER: 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={cn(
        'inline-flex items-center h-6 px-2.5 rounded-md text-[11px] font-semibold tracking-wide',
        STYLES[role],
      )}
    >
      {role}
    </span>
  );
}
