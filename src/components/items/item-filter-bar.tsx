'use client';

import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ItemStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export const ITEM_STATUSES: ItemStatus[] = ['ACTIVE', 'DRAFT', 'ARCHIVED'];

export interface ItemFilters {
  q: string;
  status: ItemStatus | '';
}

interface Props extends ItemFilters {
  onChange: (next: ItemFilters) => void;
}

export function ItemFilterBar({ q, status, onChange }: Props) {
  const [localQ, setLocalQ] = useState(q);
  const debouncedQ = useDebouncedValue(localQ, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Follow external changes (e.g. the topbar search pushes a new ?q=), but not
  // the echo of our own debounced update, which would clobber fresh keystrokes.
  useEffect(() => {
    if (q !== debouncedQ) setLocalQ(q);
  }, [q]);

  // Emit only when the debounced text itself changes. Depending on `q` too
  // would re-emit the stale debounced value right after Reset.
  useEffect(() => {
    if (debouncedQ !== q) onChange({ q: debouncedQ, status });
  }, [debouncedQ]);

  // Press "/" anywhere to jump to the search box.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4">
      <div className="flex flex-col gap-1.5 min-w-44 flex-1">
        <Label htmlFor="filter-q">Search</Label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            id="filter-q"
            ref={inputRef}
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder="Name or code…  (press / to focus)"
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5 min-w-44">
        <Label htmlFor="filter-status">Status</Label>
        <Select
          value={status === '' ? '__all' : status}
          onValueChange={(v) =>
            onChange({ q: debouncedQ, status: v === '__all' ? '' : (v as ItemStatus) })
          }
        >
          <SelectTrigger id="filter-status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All</SelectItem>
            {ITEM_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {status || debouncedQ ? (
        <Button
          variant="outline"
          onClick={() => {
            setLocalQ('');
            onChange({ q: '', status: '' });
          }}
        >
          Reset
        </Button>
      ) : null}
    </div>
  );
}
