"use client";

import Script from 'next/script';

export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Helper function to track events
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
}

// Common event tracking functions
export function trackTourRequest(communityName?: string, source?: string) {
  trackEvent('tour_request', {
    event_category: 'engagement',
    event_label: communityName || 'general',
    source: source || 'unknown'
  });
}

export function trackPricingRequest(communityName?: string, source?: string) {
  trackEvent('pricing_request', {
    event_category: 'engagement',
    event_label: communityName || 'general',
    source: source || 'unknown'
  });
}

export function trackFormSubmission(formType: string, communityName?: string) {
  trackEvent('form_submission', {
    event_category: 'conversion',
    event_label: formType,
    community: communityName || 'general',
  });
}

export function trackPhoneClick(placement: string, page?: string) {
  trackEvent('phone_click', {
    event_category: 'conversion',
    placement,
    page_path: page || (typeof window !== 'undefined' ? window.location.pathname : ''),
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
}

/** Fired once per session when user views a high-intent placement page (baseline KPI). */
export function trackPlacementPageView(pageType: string) {
  trackEvent('placement_page_view', {
    event_category: 'engagement',
    page_type: pageType,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackFormStart(formType: string) {
  trackEvent('form_start', {
    event_category: 'conversion',
    event_label: formType,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackListingFilter(filterType: string, filterValue: string, resultCount: number) {
  trackEvent('listing_filter', {
    event_category: 'engagement',
    filter_type: filterType,
    filter_value: filterValue,
    result_count: resultCount,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

export function trackFormError(formType: string, message?: string) {
  trackEvent('form_error', {
    event_category: 'conversion',
    event_label: formType,
    error_message: message || 'unknown',
  });
}

