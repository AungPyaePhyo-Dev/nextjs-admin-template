'use client';

import { Bell, HelpCircle, LogOut, Menu, Moon, Search, Settings, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState, type FormEvent } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth-context';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (theme === 'dark' || resolvedTheme === 'dark') : false;

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/items?q=${encodeURIComponent(q)}` : '/items');
  }

  return (
    <header className="h-16 shrink-0 flex items-center gap-3 px-4 sm:px-6 bg-background">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Open menu"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </Button>
      <form onSubmit={onSearch} className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items..."
          className="w-full h-10 pl-10 pr-3 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring/40"
        />
      </form>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          className="relative rounded-full"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-rose-500" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Help" className="rounded-full hidden sm:inline-flex">
          <HelpCircle className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle theme"
          className="rounded-full"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {mounted ? (isDark ? <Sun className="size-4" /> : <Moon className="size-4" />) : <Sun className="size-4" />}
        </Button>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full hover:bg-muted transition-colors"
              >
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-[11px] text-muted-foreground">Workspace</span>
                </div>
                <Avatar name={user.name} size="md" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                  <Badge variant="secondary" className="w-fit mt-1">
                    {user.role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}
