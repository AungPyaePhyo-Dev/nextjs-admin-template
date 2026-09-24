'use client';

import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import type { AdminUser, Role } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Replace with a mutation (POST /users) when wiring a backend.
  onCreate: (user: AdminUser) => Promise<void> | void;
}

const EmailSchema = z.string().email();

export function CreateUserDialog({ open, onOpenChange, onCreate }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('EDITOR');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function reset() {
    setEmail('');
    setName('');
    setPassword('');
    setRole('EDITOR');
    setFieldError(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldError(null);

    if (!EmailSchema.safeParse(email).success) {
      setFieldError('Valid email is required.');
      return;
    }
    if (name.trim().length < 1) {
      setFieldError('Name is required.');
      return;
    }
    if (password.length < 8) {
      setFieldError('Password must be at least 8 characters.');
      return;
    }

    setPending(true);
    try {
      await onCreate({
        id: `usr_${Date.now()}`,
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role,
        isActive: true,
        lastLoginAt: null,
      });
      reset();
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next && pending) return;
    if (!next) reset();
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New user</DialogTitle>
          <DialogDescription>
            Create a team member. They will sign in with email and password.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={pending}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-name">Name</Label>
            <Input
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={pending}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-password">Password</Label>
            <Input
              id="user-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={pending}
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">
              At least 8 characters. They can change it later.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="user-role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)} disabled={pending}>
              <SelectTrigger id="user-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">ADMIN — full access</SelectItem>
                <SelectItem value="EDITOR">EDITOR — create and edit</SelectItem>
                <SelectItem value="VIEWER">VIEWER — read only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {fieldError ? <p className="text-xs text-destructive">{fieldError}</p> : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Creating…' : 'Create user'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
