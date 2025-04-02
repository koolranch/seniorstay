import React from 'react';
import MapFallback from './MapFallback';
import { Community } from '@/data/facilities';

interface FacilityMapFallbackProps {
  facility: Community;
  height?: string;
  width?: string;
}

export default function FacilityMapFallback({
  facility,
  height = '450px',
  width = '100%',
}: FacilityMapFallbackProps) {
  const getDirectionsUrl = () => {
    if (!facility?.coordinates) return '';

    return `https://www.google.com/maps/dir/?api=1&destination=${facility.coordinates.lat},${facility.coordinates.lng}`;
  };

  return (
    <div className="relative" style={{ height, width }}>
      <MapFallback
        height={height}
        width={width}
      />

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <a
          href={getDirectionsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white px-4 py-2 rounded-md text-sm shadow-md hover:bg-primary/90 transition-colors"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}
