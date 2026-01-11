"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface LocationStatsProps {
  city: string;
  communities: Community[]; // Pass communities from server component
}

export default function LocationStats({ city, communities }: LocationStatsProps) {
  const decodedCity = decodeURIComponent(city);
  const cityCommunities = communities.filter(
    (community) => community.location.toLowerCase().includes(decodedCity.toLowerCase())
  );

  const totalCommunities = cityCommunities.length;
  const averageRating = totalCommunities > 0
    ? (cityCommunities.reduce((sum, community) => sum + (community.rating || 0), 0) / totalCommunities).toFixed(1)
    : '0.0';

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{totalCommunities}</h3>
            <p className="text-gray-600">Communities in {decodedCity}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{averageRating}</h3>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {cityCommunities.filter((c) => c.careTypes.includes('Memory Care')).length}
            </h3>
            <p className="text-gray-600">Memory Care Options</p>
          </div>
        </div>
      </div>
    </div>
  );
} 