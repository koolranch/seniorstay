"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface CommunityHeaderProps {
  community: Community;
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({ community }: CommunityHeaderProps) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {community.name}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {community.location}
        </p>
        <div className="flex flex-wrap gap-2">
          {community.careTypes.map((type, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}; 