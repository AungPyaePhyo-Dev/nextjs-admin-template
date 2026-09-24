'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[dashboard error]', error);
  }, [error]);

  return (
    <div className="px-4 sm:px-8 py-6">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>An unexpected error occurred. Please try again.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {error.digest ? (
            <p className="text-xs text-muted-foreground">
              Digest: <span className="font-mono">{error.digest}</span>
            </p>
          ) : null}
          <div className="flex gap-2">
            <Button onClick={() => reset()}>Try again</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
