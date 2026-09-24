'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[root error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error stopped the page from loading.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {error.digest ? (
            <p className="text-xs text-muted-foreground">
              Digest: <span className="font-mono">{error.digest}</span>
            </p>
          ) : null}
          <Button onClick={() => reset()}>Try again</Button>
        </CardContent>
      </Card>
    </div>
  );
}
