"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';
import { getDefaultAmenities } from '@/utils/amenities';
import { CheckCircle } from 'lucide-react';

interface CommunityAmenitiesProps {
  community: Community;
}

export default function CommunityAmenities({ community }: CommunityAmenitiesProps) {
  // Use actual amenities if available, otherwise generate based on care types
  const amenities = community.amenities && community.amenities.length > 0
    ? community.amenities
    : getDefaultAmenities(community.careTypes);

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Amenities & Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3"
            >
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="text-gray-900">{amenity}</p>
            </div>
          ))}
        </div>
        {!community.amenities && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            Standard amenities based on care type. Contact us for specific details about this community.
          </p>
        )}
      </div>
    </div>
  );
} 