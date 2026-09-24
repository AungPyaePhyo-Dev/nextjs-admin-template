'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
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
import { siteConfig } from '@/config/site';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

// Only allow same-app paths as a post-login destination.
function safeDest(from: string | null): string {
  return from && from.startsWith('/') && !from.startsWith('//') ? from : '/dashboard';
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { status, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dest = safeDest(params.get('from'));

  useEffect(() => {
    if (status === 'authenticated') router.replace(dest);
  }, [status, router, dest]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      await login({ email, password });
      toast.success('Signed in');
      router.replace(dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-muted/30">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle>{siteConfig.name}</CardTitle>
          <CardDescription>Sign in with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>
            {error ? (
              <div
                role="alert"
                className="text-sm rounded-md border border-destructive/30 bg-destructive/5 text-destructive px-3 py-2"
              >
                {error}
              </div>
            ) : null}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Demo mode: any email with a password of 6+ characters.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
