import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Standard page padding + vertical rhythm. Every dashboard page starts with this.
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-4 sm:px-8 py-6 flex flex-col gap-6', className)}>{children}</div>;
}
