"use client";

import * as React from 'react';
import { Community, communityData } from '@/data/facilities';
import LocationCard from '@/components/property/LocationCard';

interface SimilarCommunitiesProps {
  community: Community;
}

export default function SimilarCommunities({ community }: SimilarCommunitiesProps) {
  // Find similar communities in the same city with same care types
  const city = community.location.split(',')[0].trim();
  
  const similarCommunities = communityData
    .filter(c => 
      c.id !== community.id && // Not the same community
      c.location.includes(city) && // Same city
      c.careTypes.some(type => community.careTypes.includes(type)) // At least one matching care type
    )
    .slice(0, 4); // Limit to 4 communities

  if (similarCommunities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          More Senior Living Options in {city}
        </h2>
        <p className="text-gray-600 mb-8">
          Other communities you might want to consider in the {city} area
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarCommunities.map((comm) => (
            <LocationCard key={comm.id} community={comm} />
          ))}
        </div>
      </div>
    </div>
  );
}

