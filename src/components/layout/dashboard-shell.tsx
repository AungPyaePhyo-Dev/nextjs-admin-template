'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import { Breadcrumbs } from './breadcrumbs';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function DashboardShell({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Client-side guard. With a real cookie-based session, also add a Next.js
  // proxy (proxy.ts) so protected routes redirect before any JS runs.
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen bg-background">
        <div className="hidden md:flex md:flex-col w-64 shrink-0 bg-sidebar p-5 gap-3">
          <Skeleton className="h-6 w-32 bg-white/10" />
          <Skeleton className="h-8 w-full bg-white/10" />
          <Skeleton className="h-8 w-full bg-white/10" />
          <Skeleton className="h-8 w-full bg-white/10" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="h-16 flex items-center px-6 gap-3">
            <Skeleton className="h-10 w-80" />
          </div>
          <div className="p-6 flex flex-col gap-3">
            <Skeleton className="h-8 w-60" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative">
            <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
