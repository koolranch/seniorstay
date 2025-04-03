"use client";

import React from 'react';
import { Community } from '@/data/facilities';

interface CommunityMapFallbackProps {
  community: Community;
}

export default function CommunityMapFallback({ community }: CommunityMapFallbackProps) {
  const { coordinates } = community;
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${coordinates.lat},${coordinates.lng}`;

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
