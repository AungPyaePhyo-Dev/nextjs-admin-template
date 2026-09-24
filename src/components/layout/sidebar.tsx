'use client';

import { LayoutGrid, LogOut, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/config/nav';
import { siteConfig } from '@/config/site';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

interface SidebarProps {
  // Mobile renders inside the drawer in DashboardShell; desktop is the fixed column.
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  if (!user) return null;

  const canCreate = user.role !== 'VIEWER';

  return (
    <aside
      className={cn(
        'w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground',
        mobile ? 'flex h-full' : 'hidden md:flex',
      )}
    >
      <div className="px-5 pt-6 pb-5">
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-3">
          {/* Replace with <Image src="/logo.png" …/> for your brand. */}
          <span className="size-9 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
            <LayoutGrid className="size-5" />
          </span>
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">{siteConfig.name}</div>
            <div className="text-[10px] font-medium tracking-[0.18em] text-sidebar-foreground/50 mt-0.5">
              {siteConfig.tagline}
            </div>
          </div>
        </Link>
      </div>
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {NAV_ITEMS.map((item) => {
          if (item.roles && !item.roles.includes(user.role)) return null;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-white'
                  : 'text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/50',
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 flex flex-col gap-1 border-t border-sidebar-border">
        {canCreate ? (
          <Link
            href="/items/new"
            onClick={onNavigate}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-emerald-400/90 text-emerald-950 hover:bg-emerald-400 transition-colors"
          >
            <Plus className="size-4" />
            New Item
          </Link>
        ) : null}
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/50 transition-colors text-left"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
