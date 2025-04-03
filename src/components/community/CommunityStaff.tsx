"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface CommunityStaffProps {
  community: Community;
}

export const CommunityStaff: React.FC<CommunityStaffProps> = ({ community }: CommunityStaffProps) => {
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Our Staff
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Executive Director
            </h3>
            <p className="text-gray-600">
              Our experienced executive director leads the community with a focus on resident well-being and quality care.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Care Team
            </h3>
            <p className="text-gray-600">
              Our dedicated care team includes licensed nurses, certified nursing assistants, and trained caregivers.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Activities Director
            </h3>
            <p className="text-gray-600">
              Our activities director plans engaging programs and events to promote social interaction and mental stimulation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 