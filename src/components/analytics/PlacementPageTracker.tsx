'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPlacementPageView } from '@/components/analytics/GoogleAnalytics';

function pageTypeFromPath(path: string): string | null {
  if (/^\/cleveland\/[^/]+$/.test(path) && !path.includes('/events')) return 'city';
  if (path === '/contact') return 'contact';
  if (path.startsWith('/assessment')) return 'assessment';
  if (path.includes('/events')) return 'events';
  if (path.includes('assisted-living')) return 'care_hub_assisted';
  if (path.includes('memory-care')) return 'care_hub_memory';
  if (path.includes('senior-living-costs')) return 'care_hub_costs';
  if (path === '/cleveland') return 'region_hub';
  if (path.startsWith('/resources')) return 'resources';
  return null;
}

/** Records placement_page_view once per path per session for GA4 baseline KPIs. */
export default function PlacementPageTracker() {
  const pathname = usePathname() ?? '';
  const trackedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const pageType = pageTypeFromPath(pathname);
    if (!pageType || trackedRef.current.has(pathname)) return;
    trackedRef.current.add(pathname);
    trackPlacementPageView(pageType);
  }, [pathname]);

  return null;
}
