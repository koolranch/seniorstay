"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface LocationCommunitiesProps {
  city: string;
  communities: Community[];
}

export default function LocationCommunities({ city, communities }: LocationCommunitiesProps) {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Communities in {city}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <div
              key={community.id}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {community.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {community.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {community.careTypes.map((type, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 