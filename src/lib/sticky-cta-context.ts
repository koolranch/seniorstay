import { slugToCityName } from '@/lib/top-cleveland-cities';

export interface StickyCtaContext {
  callLabel: string;
  requestLabel: string;
  subtext?: string;
  phonePlacement: string;
  contactHref: string;
}

const SKIP_CITY_SEGMENTS = new Set(['events', 'community']);

export function getStickyCtaContext(pathname: string): StickyCtaContext {
  const regionCity = pathname.match(/^\/cleveland\/([^/]+)\/?$/);
  if (regionCity && !SKIP_CITY_SEGMENTS.has(regionCity[1])) {
    const cityName = slugToCityName(regionCity[1]);
    return {
      callLabel: `Call — ${cityName}`,
      requestLabel: 'Request Callback',
      subtext: `Free ${cityName} placement help`,
      phonePlacement: 'sticky_city',
      contactHref: `/contact?city=${encodeURIComponent(cityName)}`,
    };
  }

  const legacyCity = pathname.match(/^\/location\/([^/]+)\/?$/);
  if (legacyCity) {
    const cityName = slugToCityName(legacyCity[1]);
    return {
      callLabel: `Call — ${cityName}`,
      requestLabel: 'Request Callback',
      subtext: `Free ${cityName} placement help`,
      phonePlacement: 'sticky_city',
      contactHref: `/contact?city=${encodeURIComponent(cityName)}`,
    };
  }

  if (pathname.includes('/events')) {
    return {
      callLabel: 'Call for Help',
      requestLabel: 'Planning a Move?',
      subtext: 'Free Cleveland placement advisors',
      phonePlacement: 'sticky_events',
      contactHref: '/contact?intent=placement&source=events',
    };
  }

  if (pathname.startsWith('/assessment')) {
    return {
      callLabel: 'Call Now',
      requestLabel: 'Request Callback',
      subtext: 'Talk through your assessment results',
      phonePlacement: 'sticky_assessment',
      contactHref: '/contact?intent=placement&source=assessment',
    };
  }

  if (
    pathname.includes('assisted-living') ||
    pathname.includes('memory-care') ||
    pathname.includes('independent-living') ||
    pathname.includes('senior-living-costs')
  ) {
    return {
      callLabel: 'Call for Pricing',
      requestLabel: 'Request Callback',
      subtext: 'Compare Cleveland communities free',
      phonePlacement: 'sticky_care_hub',
      contactHref: '/contact?intent=placement',
    };
  }

  return {
    callLabel: 'Call Now',
    requestLabel: 'Request Call',
    subtext: undefined,
    phonePlacement: 'sticky_mobile',
    contactHref: '/contact?intent=placement',
  };
}
