"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface CommunityAmenitiesProps {
  community: Community;
}

export const CommunityAmenities: React.FC<CommunityAmenitiesProps> = ({ community }: CommunityAmenitiesProps) => {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Amenities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {community.amenities?.map((amenity, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {amenity}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 