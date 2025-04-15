declare global {
  interface Window {
    gtag: (param1: string, param2: string, param3?: object) => void;
  }
}

export const sendGAEvent = (action: string, label?: string) => {
  // Check if window and gtag are available (ensures it runs only client-side)
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`GA Event: Action=${action}, Label=${label || 'N/A'}`); // Optional: for debugging
    window.gtag('event', action, {
      event_category: 'CTA',
      event_label: label || '', // Use label or empty string
    });
  } else {
    console.log('GA Event Skipped (window.gtag not available):', action, label);
  }
}; 