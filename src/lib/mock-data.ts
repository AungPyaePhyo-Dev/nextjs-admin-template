// Placeholder rows so every screen has something to render.
// Replace these with real API calls (e.g. TanStack Query hooks) when wiring a backend.
import type { AdminUser, Item } from '@/types';

export const MOCK_ITEMS: Item[] = [
  {
    id: 'itm_01',
    name: 'Starter Package',
    code: 'starter-package',
    owner: 'Aye Aye',
    status: 'ACTIVE',
    description: 'Entry-level bundle shown to new customers.',
    createdAt: '2026-06-02T09:15:00Z',
    updatedAt: '2026-09-10T04:20:00Z',
  },
  {
    id: 'itm_02',
    name: 'Premium Package',
    code: 'premium-package',
    owner: 'Kyaw Zin',
    status: 'ACTIVE',
    description: 'Full feature set with priority support.',
    createdAt: '2026-06-18T11:00:00Z',
    updatedAt: '2026-09-12T08:45:00Z',
  },
  {
    id: 'itm_03',
    name: 'Holiday Promo',
    code: 'holiday-promo',
    owner: 'Su Mon',
    status: 'DRAFT',
    description: 'Seasonal campaign, not published yet.',
    createdAt: '2026-08-21T06:30:00Z',
    updatedAt: '2026-09-01T10:10:00Z',
  },
  {
    id: 'itm_04',
    name: 'Legacy Plan',
    code: 'legacy-plan',
    owner: 'Aye Aye',
    status: 'ARCHIVED',
    description: 'Kept for existing customers only.',
    createdAt: '2025-11-05T03:00:00Z',
    updatedAt: '2026-07-14T02:25:00Z',
  },
  {
    id: 'itm_05',
    name: 'Team Plan',
    code: 'team-plan',
    owner: 'Htet Naing',
    status: 'ACTIVE',
    description: 'Shared workspace for up to ten seats.',
    createdAt: '2026-07-09T13:40:00Z',
    updatedAt: '2026-09-18T07:05:00Z',
  },
  {
    id: 'itm_06',
    name: 'Trial Bundle',
    code: 'trial-bundle',
    owner: 'Su Mon',
    status: 'DRAFT',
    description: 'Seven-day trial experiment.',
    createdAt: '2026-09-03T08:00:00Z',
    updatedAt: '2026-09-20T09:30:00Z',
  },
];

export const MOCK_USERS: AdminUser[] = [
  {
    id: 'usr_01',
    email: 'admin@example.com',
    name: 'Demo Admin',
    role: 'ADMIN',
    isActive: true,
    lastLoginAt: '2026-09-23T08:12:00Z',
  },
  {
    id: 'usr_02',
    email: 'editor@example.com',
    name: 'Kyaw Zin',
    role: 'EDITOR',
    isActive: true,
    lastLoginAt: '2026-09-21T14:03:00Z',
  },
  {
    id: 'usr_03',
    email: 'viewer@example.com',
    name: 'Su Mon',
    role: 'VIEWER',
    isActive: false,
    lastLoginAt: null,
  },
];

export function getMockItem(id: string): Item | undefined {
  return MOCK_ITEMS.find((i) => i.id === id);
}
