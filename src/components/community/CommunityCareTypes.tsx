"use client";

import * as React from 'react';
import type { Community } from '../../data/facilities';

// Define the props interface
interface CommunityCareTypesProps {
  community: Community;
}

// Component to display care types
export default function CommunityCareTypes({ community }: CommunityCareTypesProps) {
  const getCareTypeDescription = (type: string): string => {
    switch (type) {
      case 'Independent Living':
        return 'Perfect for active seniors who want maintenance-free living with amenities and social opportunities.';
      case 'Assisted Living':
        return 'Ideal for seniors who need help with daily activities while maintaining independence.';
      case 'Memory Care':
        return 'Specialized care for seniors with Alzheimer\'s or other forms of dementia.';
      case 'Skilled Nursing':
        return '24/7 medical care and supervision for seniors with complex health needs.';
      case 'Rehabilitation':
        return 'Short-term therapy and recovery services to help seniors regain strength and mobility.';
      default:
        return 'Customized care services tailored to meet specific needs and preferences.';
    }
  };

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Care Types
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {community.careTypes && community.careTypes.map((type, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {type}
              </h3>
              <p className="text-gray-600">
                {getCareTypeDescription(type)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 