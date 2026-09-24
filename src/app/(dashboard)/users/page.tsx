'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { AdminUser } from '@/types';
import { RoleGate } from '@/components/auth/role-gate';
import { EmptyState } from '@/components/common/empty-state';
import { PageContainer } from '@/components/common/page-container';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { CreateUserDialog } from '@/components/users/create-user-dialog';
import { UserTable } from '@/components/users/user-table';
import { useAuth } from '@/lib/auth-context';
import { MOCK_USERS } from '@/lib/mock-data';

export default function UsersPage() {
  return (
    <RoleGate
      allow={['ADMIN']}
      fallback={
        <PageContainer className="max-w-xl">
          <EmptyState message="You do not have permission to manage users." />
        </PageContainer>
      }
    >
      <UsersInner />
    </RoleGate>
  );
}

function UsersInner() {
  const { user } = useAuth();
  // Local state stands in for a list query + create/update mutations.
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [createOpen, setCreateOpen] = useState(false);

  async function onCreate(next: AdminUser) {
    await new Promise((r) => setTimeout(r, 500));
    setUsers((prev) => [...prev, next]);
    toast.success('User created');
  }

  function onToggleActive(target: AdminUser) {
    setUsers((prev) =>
      prev.map((u) => (u.id === target.id ? { ...u, isActive: !u.isActive } : u)),
    );
    toast.success(target.isActive ? 'User disabled' : 'User enabled');
  }

  return (
    <PageContainer>
      <PageHeader
        title="Users"
        description="Dialog form pattern: create from a modal, update rows in place."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            New user
          </Button>
        }
      />

      {users.length > 0 ? (
        <UserTable
          users={users}
          currentUserEmail={user?.email ?? ''}
          onToggleActive={onToggleActive}
        />
      ) : (
        <EmptyState
          message="No users yet."
          action={<Button onClick={() => setCreateOpen(true)}>Create your first user</Button>}
        />
      )}

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={onCreate} />
    </PageContainer>
  );
}
