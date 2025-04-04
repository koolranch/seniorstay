"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface CommunityStaffProps {
  community: Community;
}

export default function CommunityStaff({ community }: CommunityStaffProps) {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Our Staff
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Executive Director
            </h3>
            <p className="text-gray-600">
              Our experienced executive director ensures the highest quality of care and services for all residents.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Care Team
            </h3>
            <p className="text-gray-600">
              Our dedicated care team provides personalized assistance and support 24/7.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Activities Director
            </h3>
            <p className="text-gray-600">
              Our activities director creates engaging programs and events to keep residents active and social.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 