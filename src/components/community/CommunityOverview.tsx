"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface CommunityOverviewProps {
  community: Community;
}

export default function CommunityOverview({ community }: CommunityOverviewProps) {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Overview
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-600">
            {community.description || 'No description available.'}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Location
            </h3>
            <p className="text-gray-600">
              {community.address || 'Address not available'}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Get Information
            </h3>
            <p className="text-gray-600">
              Email:{' '}
              <a href="mailto:info@guideforseniors.com" className="text-primary hover:underline">
                info@guideforseniors.com
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Use the buttons below to request pricing or schedule a tour.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 