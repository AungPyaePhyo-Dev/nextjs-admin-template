'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useMemo } from 'react';
import { SEGMENT_LABELS } from '@/config/nav';
import { getMockItem } from '@/lib/mock-data';

interface Crumb {
  label: string;
  href: string;
  isLast: boolean;
}

// Dynamic segments ([id]) need a human label. Swap the mock lookup for your
// query cache (e.g. queryClient.getQueryData) once real data exists.
function labelFor(seg: string, prev: string | undefined): string {
  const known = SEGMENT_LABELS[seg];
  if (known) return known;
  if (prev === 'items') return getMockItem(seg)?.name ?? seg;
  return seg;
}

export function Breadcrumbs() {
  const pathname = usePathname();

  const crumbs = useMemo<Crumb[]>(() => {
    const segments = pathname.split('/').filter(Boolean);
    let href = '';
    return segments.map((seg, i) => {
      href += `/${seg}`;
      return {
        label: labelFor(seg, segments[i - 1]),
        href,
        isLast: i === segments.length - 1,
      };
    });
  }, [pathname]);

  // A single crumb just repeats the page title — skip it.
  if (crumbs.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center text-sm px-4 sm:px-8 pt-4">
      {crumbs.map((c, idx) => (
        <Fragment key={c.href}>
          {idx > 0 ? (
            <ChevronRight className="mx-1 size-3.5 text-muted-foreground" />
          ) : null}
          {c.isLast ? (
            <span className="font-medium text-foreground">{c.label}</span>
          ) : (
            <Link href={c.href} className="text-muted-foreground hover:text-foreground">
              {c.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
