"use client";

import * as React from 'react';
import { Community } from '@/data/facilities';

interface CommunityHeaderProps {
  community: Community;
}

export default function CommunityHeader({ community }: CommunityHeaderProps) {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {community.name}
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <span>{community.location}</span>
          <span>•</span>
          <span>{community.careTypes.join(', ')}</span>
        </div>
      </div>
    </div>
  );
} 