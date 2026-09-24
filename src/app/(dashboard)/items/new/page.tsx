'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import type { ItemStatus } from '@/types';
import { EmptyState } from '@/components/common/empty-state';
import { PageContainer } from '@/components/common/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';

const CodeSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z][a-z0-9-]*$/, {
    message: 'Lowercase letters, digits and dashes only; must start with a letter.',
  });

interface FieldErrors {
  name?: string;
  code?: string;
}

export default function NewItemPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ItemStatus>('DRAFT');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  if (user?.role === 'VIEWER') {
    return (
      <PageContainer className="max-w-2xl">
        <EmptyState message="You do not have permission to create items." />
      </PageContainer>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fieldErrors: FieldErrors = {};
    if (name.trim().length < 2) fieldErrors.name = 'Name is required.';
    const parsed = CodeSchema.safeParse(code);
    if (!parsed.success) fieldErrors.code = parsed.error.issues[0]?.message ?? 'Invalid code';
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setPending(true);
    try {
      // Replace with a create mutation, then route to the new record's detail page.
      await new Promise((r) => setTimeout(r, 500));
      toast.success('Item created', { description: `${name.trim()} (${code})` });
      router.replace('/items');
    } finally {
      setPending(false);
    }
  }

  return (
    <PageContainer className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>New item</CardTitle>
          <CardDescription>Form page pattern: validation, pending state and redirect.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Starter Package"
                aria-invalid={errors.name ? true : undefined}
                disabled={pending}
              />
              {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="starter-package"
                aria-invalid={errors.code ? true : undefined}
                disabled={pending}
              />
              <p className="text-xs text-muted-foreground">
                lowercase-with-dashes, e.g. <span className="font-mono">starter-package</span>
              </p>
              {errors.code ? <p className="text-xs text-destructive">{errors.code}</p> : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={pending}
                className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ItemStatus)} disabled={pending}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={pending}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? 'Creating…' : 'Create item'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
