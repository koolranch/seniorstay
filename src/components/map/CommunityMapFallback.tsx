import React from 'react';
import { Community } from '@/data/facilities';
import Link from 'next/link';
import MapFallback from './MapFallback';

interface CommunityMapFallbackProps {
  communities: Community[];
  height?: string;
  width?: string;
}

export default function CommunityMapFallback({
  communities,
  height = '450px',
  width = '100%'
}: CommunityMapFallbackProps) {
  // Filter communities with coordinates
  const communitiesWithCoordinates = communities.filter(c => c.coordinates);

  return (
    <div className="grid grid-rows-[auto_1fr] rounded-lg overflow-hidden" style={{ height, width }}>
      <MapFallback
        height="200px"
        width="100%"
      />

      <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg p-4 overflow-y-auto">
        <h3 className="font-semibold text-sm mb-3">Available Communities:</h3>

        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
          {communitiesWithCoordinates.map(community => (
            <div key={community.id} className="bg-gray-50 p-3 rounded border border-gray-200 text-left">
              <h4 className="font-medium text-sm">{community.name}</h4>
              {community.address && (
                <p className="text-xs text-gray-600 mt-1">{community.address}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {community.careTypes.map((type, idx) => (
                  <span key={idx} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-[10px]">
                    {type}
                  </span>
                ))}
              </div>
              {/* SEO Fix: Use canonical region-based URL */}
              <Link
                href={`/cleveland/community/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="block mt-2 text-xs text-primary hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
