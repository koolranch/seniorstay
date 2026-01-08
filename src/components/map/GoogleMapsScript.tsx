"use client";

import React, { useEffect, useState } from 'react';

// Google Maps API key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// Add global type declaration for the custom event
declare global {
  interface Window {
    initGoogleMaps?: () => void;
    gm_authFailure?: () => void;
  }
}

export default function GoogleMapsScript() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (document.getElementById('google-maps-script')) {
      if (window.google?.maps) {
        setIsLoaded(true);
        // Dispatch event for components waiting for the API
        window.dispatchEvent(new Event('google-maps-loaded'));
      }
      return;
    }

    // Add global error handler for authentication failures
    window.gm_authFailure = function() {
      console.error('Google Maps authentication failed - API key may be invalid or restricted');
      setHasError(true);
      document.dispatchEvent(new CustomEvent('google-maps-error', {
        detail: { message: 'API key authentication failed' }
      }));
    };

    // Create script element
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    // Define callback function for when the API is loaded
    window.initGoogleMaps = function() {
      setIsLoaded(true);
      // Dispatch a custom event that other components can listen for
      window.dispatchEvent(new Event('google-maps-loaded'));
      console.log('Google Maps API loaded successfully');
    };

    // Handle errors
    script.onerror = (event) => {
      setHasError(true);
      console.error('Failed to load Google Maps API', event);
      document.dispatchEvent(new CustomEvent('google-maps-error', {
        detail: { message: 'Failed to load script' }
      }));
    };

    // Add script to document
    document.head.appendChild(script);

    // Set a timeout to detect if the API doesn't load within a reasonable time
    const timeout = setTimeout(() => {
      if (!window.google?.maps) {
        console.error('Google Maps API failed to load within timeout period');
        setHasError(true);
        document.dispatchEvent(new CustomEvent('google-maps-error', {
          detail: { message: 'Loading timeout' }
        }));
      }
    }, 10000);

    // Cleanup
    return () => {
      // Only remove the callback, not the script itself
      window.initGoogleMaps = undefined;
      window.gm_authFailure = undefined;
      clearTimeout(timeout);
    };
  }, []);

  return null; // This component doesn't render anything
}
