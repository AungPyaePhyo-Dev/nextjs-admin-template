'use client';

import type { ReactNode } from 'react';
import type { Role } from '@/types';
import { useAuth } from '@/lib/auth-context';

interface RoleGateProps {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGate({ allow, children, fallback = null }: RoleGateProps) {
  const { user } = useAuth();
  if (!user || !allow.includes(user.role)) return <>{fallback}</>;
  return <>{children}</>;
}
