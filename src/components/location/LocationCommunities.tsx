"use client";

import * as React from 'react';
import { communityData } from '@/data/facilities';
import PropertyCard from '@/components/property/PropertyCard';

interface LocationCommunitiesProps {
  city: string;
}

export const LocationCommunities: React.FC<LocationCommunitiesProps> = ({ city }: LocationCommunitiesProps) => {
  const decodedCity = decodeURIComponent(city);
  const cityCommunities = communityData.filter(
    community => community.location.toLowerCase().includes(decodedCity.toLowerCase())
  );

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Senior Living Communities in {decodedCity}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cityCommunities.map((community) => (
            <PropertyCard key={community.id} community={community} />
          ))}
        </div>
      </div>
    </div>
  );
}; 