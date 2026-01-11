"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface LocationMapProps {
  city: string;
  communities: Community[]; // Pass communities from server component
}

export default function LocationMap({ city, communities }: LocationMapProps) {
  const decodedCity = decodeURIComponent(city);
  const cityCommunities = communities.filter(
    community => community.location.toLowerCase().includes(decodedCity.toLowerCase())
  );

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Senior Living Communities in {decodedCity}
        </h2>
        <div className="h-[400px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">Map View Coming Soon</p>
            <p className="text-gray-400">
              {cityCommunities.length} communities found in {decodedCity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 