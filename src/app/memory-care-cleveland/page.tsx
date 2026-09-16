import React from 'react';
import { fetchAllCommunities } from '@/lib/fetch-community';
import { isSkilledNursingFocused, sortCommunitiesForDisplay } from '@/lib/community-listing-utils';
import MemoryCareClevelandClient from './MemoryCareClevelandClient';

// ISR: Revalidate every hour
export const revalidate = 3600;

export default async function MemoryCareClevelandPage() {
  // Fetch live community data from Supabase
  const communityData = await fetchAllCommunities();
  
  // Filter for Cleveland-area memory care communities (include Chagrin Valley)
  const clevelandCities = [
    'Cleveland',
    'Shaker Heights',
    'Beachwood',
    'Parma',
    'Lakewood',
    'Westlake',
    'Strongsville',
    'Independence',
    'Seven Hills',
    'Rocky River',
    'Chagrin Falls',
    'Solon',
    'Aurora',
    'South Russell',
  ];
  const memoryCareCommunities = sortCommunitiesForDisplay(
    communityData.filter((community) =>
      community.careTypes.some((type) => type.toLowerCase().includes('memory')) &&
      !isSkilledNursingFocused(community) &&
      clevelandCities.some((city) => community.location.toLowerCase().includes(city.toLowerCase()))
    )
  ).slice(0, 8);

  return <MemoryCareClevelandClient communities={memoryCareCommunities} />;
}
