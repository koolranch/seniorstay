import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Community } from '@/data/facilities';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import MapFallback from './MapFallback';

interface MapComponentProps {
  communities?: Community[] | null;
  facilities?: Community[] | null; // Backward compatibility for facilities prop
  height?: string;
  width?: string;
  zoom?: number;
  showInfoWindows?: boolean;
  onCommunityClick?: (community: Community) => void;
  center?: { lat: number; lng: number };
}

export default function MapComponent({
  communities,
  facilities,
  height = '450px',
  width = '100%',
  zoom = 10,
  showInfoWindows = true,
  onCommunityClick,
  center
}: MapComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const infoWindows = useRef<google.maps.InfoWindow[]>([]);
  const router = useRouter();
  const [googleMapsAttempts, setGoogleMapsAttempts] = useState(0);
  const mapInitializedRef = useRef(false); // Track successful init to prevent stale closure timeout

  // This prevents hydration mismatches
  const [isMounted, setIsMounted] = useState(false);

  // Memoize communitiesData to prevent unnecessary recalculations
  const communitiesData = useMemo(() => 
    communities || facilities || [],
    [communities, facilities]
  );

  // Memoize validCommunities to prevent unnecessary recalculations
  const validCommunities = useMemo(() => 
    Array.isArray(communitiesData) ? communitiesData.filter(Boolean) : [],
    [communitiesData]
  );

  // Memoize communityCenter to prevent unnecessary recalculations
  const communityCenter = useMemo(() => 
    center || (validCommunities.length > 0 && validCommunities[0]?.coordinates
      ? {
          lat: validCommunities[0].coordinates.lat,
          lng: validCommunities[0].coordinates.lng
        }
      : { lat: 41.4993, lng: -81.6944 }), // Default to Cleveland coordinates
    [center, validCommunities]
  );

  // Set mounted state after component mounts to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Skip on server-side or during hydration

    // Listen for Google Maps API errors
    const handleApiError = (event: Event) => {
      const customEvent = event as CustomEvent;
      setError(`Google Maps error: ${customEvent.detail?.message || 'Unknown error'}`);
      setLoading(false);
    };

    document.addEventListener('google-maps-error', handleApiError);

    const initMap = () => {
      // Skip if map already initialized to prevent re-initialization loops
      if (mapInitializedRef.current) return;
      if (!ref.current) return;

      try {
        // Check if Google Maps is available
        if (typeof window === 'undefined' || !window.google?.maps) {
          console.error('Google Maps API not loaded yet, waiting...');
          // Increment attempts counter
          setGoogleMapsAttempts(prev => prev + 1);

          // If we've tried multiple times, throw an error
          if (googleMapsAttempts >= 3) {
            throw new Error('Google Maps API failed to load after multiple attempts');
          }
          // We'll try again when the script is loaded
          return;
        }

        // Reset attempts counter on success
        setGoogleMapsAttempts(0);

        // Create map instance
        const mapInstance = new window.google.maps.Map(ref.current, {
          center: communityCenter,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(mapInstance);
        setLoading(false);
        mapInitializedRef.current = true; // Mark as initialized to prevent timeout error

        // Clear any existing markers and info windows
        markers.current.forEach(marker => marker.setMap(null));
        infoWindows.current.forEach(infoWindow => infoWindow.close());
        markers.current = [];
        infoWindows.current = [];

        // Add markers for each community with coordinates
        validCommunities.forEach(community => {
          if (community && community.coordinates) {
            // Safely access community properties with optional chaining
            const marker = new google.maps.Marker({
              position: {
                lat: community.coordinates.lat,
                lng: community.coordinates.lng
              },
              map: mapInstance,
              title: community.name,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#FF385C',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 8
              }
            });

            // Create info window content with safe property access
            const contentString = `
              <div style="width: 200px; padding: 5px;">
                <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">${community.name || 'Unnamed Community'}</h3>
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${community.location || 'Location unknown'}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 3px; margin-top: 5px;">
                  ${(community.careTypes || []).map(type =>
                    `<span style="background-color: rgba(255, 56, 92, 0.1); color: #FF385C; border-radius: 20px; padding: 2px 6px; font-size: 10px;">${type}</span>`
                  ).join('')}
                </div>
                <a href="/community/${community.id}/${(community.name || 'community').toLowerCase().replace(/\\s+/g, '-')}"
                   style="display: block; text-align: center; margin-top: 8px; color: #FF385C; font-size: 12px; text-decoration: none;">
                   View Details
                </a>
              </div>
            `;

            // Create info window
            if (showInfoWindows) {
              const infoWindow = new google.maps.InfoWindow({
                content: contentString,
                ariaLabel: community.name || 'Community',
              });

              infoWindows.current.push(infoWindow);

              // Add click listener to marker
              marker.addListener('click', () => {
                // Close all open info windows
                infoWindows.current.forEach(w => w.close());

                // Open this info window
                infoWindow.open({
                  anchor: marker,
                  map: mapInstance
                });

                if (onCommunityClick) {
                  onCommunityClick(community);
                }
              });
            } else if (onCommunityClick) {
              marker.addListener('click', () => {
                onCommunityClick(community);
              });
            } else {
              // Navigate to community detail page on click
              marker.addListener('click', () => {
                router.push(`/community/${community.id}/${(community.name || 'community').toLowerCase().replace(/\\s+/g, '-')}`);
              });
            }

            markers.current.push(marker);
          }
        });

        // Fit bounds if multiple markers
        if (markers.current.length > 1) {
          const bounds = new google.maps.LatLngBounds();
          markers.current.forEach(marker => {
            const position = marker.getPosition();
            if (position) bounds.extend(position);
          });
          mapInstance.fitBounds(bounds);

          // Don't zoom in too much
          const listener = google.maps.event.addListener(mapInstance, 'idle', () => {
            const currentZoom = mapInstance.getZoom();
            if (currentZoom !== undefined && currentZoom > 15) {
              mapInstance.setZoom(15);
            }
            google.maps.event.removeListener(listener);
          });
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load Google Maps. Please check your internet connection and try again.');
        setLoading(false);
      }
    };

    // Try to initialize the map
    const attemptInitMap = () => {
      // Check if the script is loaded
      if (window.google?.maps) {
        initMap();
      } else {
        console.log('Google Maps not yet available, waiting for script to load...');
      }
    };

    // Set up an event listener for when the Google Maps script loads
    const handleScriptLoad = () => {
      console.log('Google Maps loaded event received');
      attemptInitMap();
    };

    // Listen for the custom event from the script loader
    window.addEventListener('google-maps-loaded', handleScriptLoad);

    // Try immediately in case the script is already loaded
    attemptInitMap();

    // Check periodically if the API has loaded (as a fallback)
    const checkInterval = setInterval(() => {
      if (window.google?.maps) {
        clearInterval(checkInterval);
        console.log('Google Maps detected via interval check');
        initMap();
      }
    }, 1000);

    // Clear the interval after 10 seconds as a safety measure
    const timeoutId = setTimeout(() => {
      clearInterval(checkInterval);
      // Use ref to check if map was initialized (avoids stale closure issue)
      if (!mapInitializedRef.current) {
        console.warn('Map initialization timeout - this should only appear if map truly failed');
        setError('Map temporarily unavailable. Please refresh the page.');
        setLoading(false);
      }
    }, 10000);

    return () => {
      window.removeEventListener('google-maps-loaded', handleScriptLoad);
      document.removeEventListener('google-maps-error', handleApiError);
      clearInterval(checkInterval);
      clearTimeout(timeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, validCommunities, communityCenter, zoom, showInfoWindows, onCommunityClick, router]);
  // Note: Intentionally omitting map, error, and googleMapsAttempts from deps to prevent infinite re-initialization loops

  // Return loading placeholder during server-side rendering or hydration
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height, width }}>
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height, width }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <MapFallback
        height={height}
        width={width}
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return <div ref={ref} style={{ height, width }} className="rounded-lg" />;
}
