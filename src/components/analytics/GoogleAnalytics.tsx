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
          ${process.env.NEXT_PUBLIC_GFS_GOOGLE_ADS_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GFS_GOOGLE_ADS_ID}');` : ''}
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

function trackGfsAdsConversion(label?: string) {
  const adsId = process.env.NEXT_PUBLIC_GFS_GOOGLE_ADS_ID;
  if (!adsId || !label) {
    return;
  }
  trackEvent('conversion', {
    send_to: `${adsId}/${label}`,
  });
}

export function trackPhoneClick(placement: string, page?: string) {
  trackEvent('phone_click', {
    event_category: 'conversion',
    placement,
    page_path: page || (typeof window !== 'undefined' ? window.location.pathname : ''),
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
  trackGfsAdsConversion(process.env.NEXT_PUBLIC_GFS_ADS_PHONE_LABEL);
}

export function trackBookedCallback(source: string) {
  trackEvent('booked_callback', {
    event_category: 'conversion',
    event_label: source,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
  trackGfsAdsConversion(process.env.NEXT_PUBLIC_GFS_ADS_CALLBACK_LABEL);
}

export function trackSuccessfulLeadConversion(input: {
  pageType?: string | null;
  phone?: string | null;
  formType?: string;
  bookedCallback?: boolean;
}) {
  trackFormSubmission(input.formType || input.pageType || 'lead');
  if (input.bookedCallback) {
    trackBookedCallback(input.pageType || input.formType || 'lead');
  }
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

