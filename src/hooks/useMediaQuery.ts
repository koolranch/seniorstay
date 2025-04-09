"use client";

import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting if a media query matches
 *
 * @param query CSS media query string (e.g. '(max-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false on the server or during initial client load
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window exists (client-side only)
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);

      // Set initial value
      setMatches(media.matches);

      // Define listener function
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add listener for changes
      media.addEventListener('change', listener);

      // Clean up listener on unmount
      return () => {
        media.removeEventListener('change', listener);
      };
    }
  }, [query]);

  return matches;
}
