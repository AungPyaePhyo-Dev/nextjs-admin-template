# Admin Template

A custom Next.js admin dashboard boilerplate. It provides the **UI structure and page flow only**: there is no API client, no data fetching and no backend auth. Every screen runs on placeholder data, so you can start a new admin panel and wire in real data one module at a time.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui (`radix-nova` style, `neutral` base) · Radix UI · lucide-react · next-themes · sonner · zod

## Setup

```bash
pnpm install
pnpm dev       # http://localhost:3002
```

Demo sign-in: any email, with a password of 6 or more characters.

| Command | Description |
| --- | --- |
| `pnpm dev` | Dev server on port 3002 |
| `pnpm build` | Production build |
| `pnpm start` | Run the built server on port 3002 |
| `pnpm typecheck` | `tsc --noEmit` |

## Flow

```
/            → redirect to /dashboard
/login       → mock sign-in → back to ?from= or /dashboard
(dashboard)  → DashboardShell: auth guard, sidebar, topbar, breadcrumbs
  /dashboard       stat cards + recent list
  /items           list: URL-synced filters, table, row actions, confirm dialog
  /items/new       form: zod validation, pending state, redirect
  /items/[id]      detail: info cards, tabs, archive/restore
  /users           ADMIN only: table + create-in-dialog
  /settings        tabs: profile form, theme, notification checkboxes
```

## Structure

```
src/
  app/
    (auth)/login/          sign-in page
    (dashboard)/           protected pages + layout/loading/error
    layout.tsx providers.tsx globals.css error.tsx not-found.tsx
  components/
    ui/                    shadcn components (add more: pnpm dlx shadcn@latest add <name>)
    layout/                sidebar, topbar, breadcrumbs, dashboard-shell
    common/                page-container, page-header, empty-state, confirm-dialog, info-row, table-skeleton
    auth/role-gate.tsx     show/hide UI by role
    items/  users/         module components (copy these for a new module)
  config/
    site.ts                app name + tagline
    nav.ts                 sidebar links, per-link roles, breadcrumb labels
  lib/
    auth-context.tsx       mock session (localStorage), exposes useAuth()
    mock-data.ts           placeholder rows, replace with API calls
    format.ts utils.ts
  hooks/use-debounced-value.ts
  types/index.ts
```

## Adding a module

1. Add the type to `src/types/index.ts`.
2. Copy `app/(dashboard)/items` → `app/(dashboard)/<module>` and `components/items` → `components/<module>`.
3. Add the link to `NAV_ITEMS` and the segment label to `SEGMENT_LABELS` in `src/config/nav.ts`.

## Wiring real data

- **Auth:** replace the bodies of `login`, `logout` and the initial restore in `src/lib/auth-context.tsx`. Keep the `useAuth()` shape and the rest of the app stays the same. With cookie sessions, add a `proxy.ts` so protected routes redirect on the server.
- **Data:** add TanStack Query (a `QueryClientProvider` in `app/providers.tsx`), then swap each `MOCK_*` import and `setTimeout` for a query or mutation hook.
- **Roles:** set `DEMO_ROLE` in `auth-context.tsx` to `EDITOR` or `VIEWER` to preview the role-gated UI.
