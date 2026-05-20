'use client';

import { usePathname } from 'next/navigation';
import ContextualStickyCTA from '@/components/conversion/ContextualStickyCTA';

/** Mobile call bar on high-intent pages; hidden on community detail (has its own CTAs). */
export default function SitewideConversionBar() {
  const pathname = usePathname() ?? '';

  if (pathname.includes('/community/')) {
    return null;
  }

  return <ContextualStickyCTA />;
}
