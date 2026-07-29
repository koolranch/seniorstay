import React from 'react';
import { fetchAllCommunities } from '@/lib/fetch-community';
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
  const memoryCareCommunities = communityData.filter(c => 
    c.careTypes.includes('Memory Care') &&
    clevelandCities.some(city => c.location.toLowerCase().includes(city.toLowerCase()))
  ).slice(0, 8);

  return <MemoryCareClevelandClient communities={memoryCareCommunities} />;
}
