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
    community: communityName || 'general'
  });
}

