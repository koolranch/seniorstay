"use client";

import * as React from 'react';
import { communityData } from '@/data/facilities';
import dynamic from 'next/dynamic';

interface Community {
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface MapProps {
  communities: Community[];
}

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic<MapProps>(() => import('@/components/map/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface LocationMapProps {
  city: string;
}

export const LocationMap: React.FC<LocationMapProps> = ({ city }: LocationMapProps) => {
  const decodedCity = decodeURIComponent(city);
  const cityCommunities = communityData.filter(
    (community: Community) => community.location.toLowerCase().includes(decodedCity.toLowerCase())
  );

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Senior Living Communities in {decodedCity}
        </h2>
        <div className="h-[400px] rounded-lg overflow-hidden">
          <Map communities={cityCommunities} />
        </div>
      </div>
    </div>
  );
}; 