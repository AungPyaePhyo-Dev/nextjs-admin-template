import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  message: ReactNode;
  action?: ReactNode;
  tone?: 'default' | 'error';
}

export function EmptyState({ message, action, tone = 'default' }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center flex flex-col items-center gap-3">
        <p className={tone === 'error' ? 'text-sm text-destructive' : 'text-muted-foreground'}>
          {message}
        </p>
        {action}
      </CardContent>
    </Card>
  );
}
