'use client';

import { EllipsisVertical } from 'lucide-react';
import type { AdminUser } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import { RoleBadge } from './role-badge';

interface Props {
  users: AdminUser[];
  currentUserEmail: string;
  onToggleActive: (user: AdminUser) => void;
}

export function UserTable({ users, currentUserEmail, onToggleActive }: Props) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last login</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const isSelf = u.email === currentUserEmail;
            return (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} seed={u.id} size="sm" />
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">
                        {u.name}
                        {isSelf ? <span className="text-muted-foreground font-normal"> (you)</span> : null}
                      </span>
                      <span className="text-xs text-muted-foreground">{u.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <RoleBadge role={u.role} />
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <span
                      className={`size-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-muted-foreground/50'}`}
                    />
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Never'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Actions" disabled={isSelf}>
                        <EllipsisVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onToggleActive(u)}>
                        {u.isActive ? 'Disable' : 'Enable'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
