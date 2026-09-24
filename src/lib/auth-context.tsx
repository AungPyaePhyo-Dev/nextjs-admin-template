'use client';

// Mock session: any email + a password of 6+ characters signs in, and the
// session lives in localStorage so a refresh keeps you signed in.
// Swap `login` / `logout` / the initial restore for real API calls later —
// the rest of the app only depends on the `useAuth()` shape below.

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Role, SessionUser } from '@/types';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: SessionUser | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = 'admin-template.session';

// Change to 'EDITOR' or 'VIEWER' to preview role-gated UI.
const DEMO_ROLE: Role = 'ADMIN';

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): SessionUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

function writeSession(user: SessionUser | null) {
  try {
    if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode etc.) — session just won't survive a reload.
  }
}

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'user';
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p[0]!.toUpperCase() + p.slice(1))
    .join(' ');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const router = useRouter();

  useEffect(() => {
    const restored = readSession();
    setUser(restored);
    setStatus(restored ? 'authenticated' : 'unauthenticated');
  }, []);

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    // Simulated network latency so loading states are visible.
    await new Promise((r) => setTimeout(r, 500));
    if (password.length < 6) {
      throw new Error('Invalid email or password.');
    }
    const next: SessionUser = {
      id: 'usr_01',
      email,
      name: nameFromEmail(email) || 'Demo Admin',
      role: DEMO_ROLE,
    };
    writeSession(next);
    setUser(next);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setUser(null);
    setStatus('unauthenticated');
    router.replace('/login');
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, login, logout }),
    [status, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
