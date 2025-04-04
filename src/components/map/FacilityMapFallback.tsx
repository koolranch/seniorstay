"use client";

import React from 'react';
import { Community } from '@/data/facilities';

interface CommunityMapFallbackProps {
  community: Community;
}

export default function CommunityMapFallback({ community }: CommunityMapFallbackProps) {
  const { coordinates, address } = community;

  // If coordinates are missing, try to use the address for the map
  const mapUrl = coordinates
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${coordinates.lat},${coordinates.lng}`
    : address
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`
    : null;

  // If no location data is available, show a fallback message
  if (!mapUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Map location not available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
