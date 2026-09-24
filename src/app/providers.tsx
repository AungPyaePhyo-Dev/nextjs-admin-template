'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/auth-context';

// Add a QueryClientProvider (TanStack Query) here once a real API is wired in.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>{children}</AuthProvider>
      <Toaster position="top-right" richColors closeButton />
    </ThemeProvider>
  );
}
