'use client';

import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import type { Item } from '@/types';
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
import { formatDateOnly } from '@/lib/format';
import { ItemStatusBadge } from './item-status-badge';

interface Props {
  items: Item[];
  onToggleArchive: (item: Item) => void;
}

export function ItemTable({ items, onToggleArchive }: Props) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b">
        <h2 className="text-base font-semibold tracking-tight">All items</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Link href={`/items/${item.id}`} className="flex items-center gap-3 group/name">
                  <Avatar name={item.name} seed={item.id} size="sm" />
                  <span className="font-medium group-hover/name:underline">{item.name}</span>
                </Link>
              </TableCell>
              <TableCell className="font-mono text-xs">{item.code}</TableCell>
              <TableCell className="text-sm">{item.owner}</TableCell>
              <TableCell>
                <ItemStatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDateOnly(item.updatedAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Actions">
                      <EllipsisVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/items/${item.id}`}>View detail</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleArchive(item)}>
                      {item.status === 'ARCHIVED' ? 'Restore' : 'Archive'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="px-5 py-3 border-t text-xs text-muted-foreground">
        Showing {items.length} {items.length === 1 ? 'item' : 'items'}
      </div>
    </div>
  );
}
