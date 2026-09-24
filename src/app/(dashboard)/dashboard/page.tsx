'use client';

import { Archive, FileText, PencilLine, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { ItemStatusBadge } from '@/components/items/item-status-badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { formatDateOnly, formatNumber } from '@/lib/format';
import { MOCK_ITEMS, MOCK_USERS } from '@/lib/mock-data';

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const stats: Stat[] = [
    { label: 'Total items', value: MOCK_ITEMS.length, icon: FileText, href: '/items' },
    {
      label: 'Active',
      value: MOCK_ITEMS.filter((i) => i.status === 'ACTIVE').length,
      icon: PencilLine,
      href: '/items?status=ACTIVE',
    },
    {
      label: 'Archived',
      value: MOCK_ITEMS.filter((i) => i.status === 'ARCHIVED').length,
      icon: Archive,
      href: '/items?status=ARCHIVED',
    },
    { label: 'Users', value: MOCK_USERS.length, icon: Users, href: '/users' },
  ];

  const recent = [...MOCK_ITEMS]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return (
    <PageContainer>
      <PageHeader title="Dashboard" description={`Welcome back, ${user.name}.`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-semibold tracking-tight mt-1">
                      {formatNumber(s.value)}
                    </p>
                  </div>
                  <span className="size-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="size-5 text-muted-foreground" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recently updated</CardTitle>
            <CardDescription>The latest changes across all items.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            {recent.map((item) => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="flex items-center justify-between gap-3 py-2.5 border-b last:border-b-0 hover:bg-muted/50 -mx-2 px-2 rounded-md"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.owner} · {formatDateOnly(item.updatedAt)}
                  </p>
                </div>
                <ItemStatusBadge status={item.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting started</CardTitle>
            <CardDescription>Where to plug in your own screens.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground flex flex-col gap-2">
            <p>
              Sidebar links live in <code className="font-mono text-foreground">src/config/nav.ts</code>.
            </p>
            <p>
              Placeholder rows come from{' '}
              <code className="font-mono text-foreground">src/lib/mock-data.ts</code> — replace
              them with API calls.
            </p>
            <p>
              Copy <code className="font-mono text-foreground">app/(dashboard)/items</code> as the
              starting point for a new list → detail → form module.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
