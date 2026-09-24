'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Item } from '@/types';
import { RoleGate } from '@/components/auth/role-gate';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { EmptyState } from '@/components/common/empty-state';
import { InfoRow } from '@/components/common/info-row';
import { PageContainer } from '@/components/common/page-container';
import { ItemStatusBadge } from '@/components/items/item-status-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/format';
import { getMockItem } from '@/lib/mock-data';

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  // Replace with a query hook, e.g. useItem(params.id), and handle its loading state.
  const [item, setItem] = useState<Item | undefined>(() => getMockItem(params.id));
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Captured when the dialog opens so its text doesn't flip once status changes.
  const [archiving, setArchiving] = useState(true);

  if (!item) {
    return (
      <PageContainer>
        <EmptyState
          message="Item not found."
          action={
            <Button asChild variant="outline">
              <Link href="/items">Back to items</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  async function onConfirmToggle() {
    await new Promise((r) => setTimeout(r, 400));
    setItem((prev) => (prev ? { ...prev, status: archiving ? 'ARCHIVED' : 'ACTIVE' } : prev));
    toast.success(archiving ? 'Item archived' : 'Item restored');
  }

  return (
    <PageContainer>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            {item.name}
            <ItemStatusBadge status={item.status} />
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono">{item.code}</p>
        </div>
        <RoleGate allow={['ADMIN', 'EDITOR']}>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.info('Hook up an edit form here.')}>
              Edit
            </Button>
            <Button
              variant={item.status !== 'ARCHIVED' ? 'destructive' : 'default'}
              onClick={() => {
                setArchiving(item.status !== 'ARCHIVED');
                setConfirmOpen(true);
              }}
            >
              {item.status !== 'ARCHIVED' ? 'Archive' : 'Restore'}
            </Button>
          </div>
        </RoleGate>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
          </CardHeader>
          <CardContent className="text-sm flex flex-col gap-2">
            <InfoRow label="Name" value={item.name} />
            <InfoRow label="Code" value={<span className="font-mono">{item.code}</span>} />
            <InfoRow label="Status" value={<ItemStatusBadge status={item.status} />} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ownership</CardTitle>
            <CardDescription>Who is responsible for this item.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm flex flex-col gap-2">
            <InfoRow label="Owner" value={item.owner} />
            <InfoRow label="ID" value={<span className="font-mono">{item.id}</span>} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Timestamps</CardTitle>
          </CardHeader>
          <CardContent className="text-sm flex flex-col gap-2">
            <InfoRow label="Created" value={formatDate(item.createdAt)} />
            <InfoRow label="Updated" value={formatDate(item.updatedAt)} />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardContent className="text-sm">
              {item.description || <span className="text-muted-foreground">No description.</span>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <EmptyState message="No activity yet. Render an audit log or child table here." />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={archiving ? 'Archive item?' : 'Restore item?'}
        description={
          archiving
            ? `"${item.name}" will be hidden from active lists. You can restore it later.`
            : `"${item.name}" will become active again.`
        }
        confirmLabel={archiving ? 'Archive' : 'Restore'}
        destructive={archiving}
        onConfirm={onConfirmToggle}
      />
    </PageContainer>
  );
}
