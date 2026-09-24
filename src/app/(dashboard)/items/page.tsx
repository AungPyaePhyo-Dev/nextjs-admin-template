'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { Item, ItemStatus } from '@/types';
import { RoleGate } from '@/components/auth/role-gate';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { EmptyState } from '@/components/common/empty-state';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { TableSkeleton } from '@/components/common/table-skeleton';
import { ITEM_STATUSES, ItemFilterBar, type ItemFilters } from '@/components/items/item-filter-bar';
import { ItemTable } from '@/components/items/item-table';
import { Button } from '@/components/ui/button';
import { MOCK_ITEMS } from '@/lib/mock-data';

export default function ItemsPage() {
  // useSearchParams needs a Suspense boundary for static prerendering.
  return (
    <Suspense fallback={<PageContainer><TableSkeleton /></PageContainer>}>
      <ItemsInner />
    </Suspense>
  );
}

function ItemsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters live in the URL so they survive refresh and can be shared.
  const q = searchParams.get('q') ?? '';
  const rawStatus = searchParams.get('status') ?? '';
  const status: ItemStatus | '' = ITEM_STATUSES.includes(rawStatus as ItemStatus)
    ? (rawStatus as ItemStatus)
    : '';

  // Local copy so Archive/Restore visibly works; a real app would refetch.
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  // Target is kept after close so the dialog text doesn't change mid-animation.
  const [target, setTarget] = useState<Item | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const updateParams = useCallback(
    (next: ItemFilters) => {
      const sp = new URLSearchParams();
      if (next.q) sp.set('q', next.q);
      if (next.status) sp.set('status', next.status);
      const qs = sp.toString();
      router.replace(qs ? `?${qs}` : '?');
    },
    [router],
  );

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (i) =>
        (!status || i.status === status) &&
        (!needle || i.name.toLowerCase().includes(needle) || i.code.includes(needle)),
    );
  }, [items, q, status]);

  const archiving = target?.status !== 'ARCHIVED';

  async function onConfirmToggle() {
    if (!target) return;
    // Simulated request.
    await new Promise((r) => setTimeout(r, 400));
    const nextStatus: ItemStatus = archiving ? 'ARCHIVED' : 'ACTIVE';
    setItems((prev) => prev.map((i) => (i.id === target.id ? { ...i, status: nextStatus } : i)));
    toast.success(archiving ? 'Item archived' : 'Item restored');
  }

  return (
    <PageContainer>
      <PageHeader
        title="Items"
        description="List page pattern: URL-synced filters, table, row actions and a confirm dialog."
        actions={
          <RoleGate allow={['ADMIN', 'EDITOR']}>
            <Button asChild>
              <Link href="/items/new">
                <Plus className="size-4" />
                New item
              </Link>
            </Button>
          </RoleGate>
        }
      />

      <ItemFilterBar q={q} status={status} onChange={updateParams} />

      {rows.length > 0 ? (
        <ItemTable
          items={rows}
          onToggleArchive={(item) => {
            setTarget(item);
            setConfirmOpen(true);
          }}
        />
      ) : (
        <EmptyState
          message={q || status ? 'No items match these filters.' : 'No items yet.'}
          action={
            q || status ? (
              <Button variant="outline" onClick={() => updateParams({ q: '', status: '' })}>
                Clear filters
              </Button>
            ) : null
          }
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={archiving ? 'Archive item?' : 'Restore item?'}
        description={
          archiving
            ? `"${target?.name}" will be hidden from active lists. You can restore it later.`
            : `"${target?.name}" will become active again.`
        }
        confirmLabel={archiving ? 'Archive' : 'Restore'}
        destructive={archiving}
        onConfirm={onConfirmToggle}
      />
    </PageContainer>
  );
}
