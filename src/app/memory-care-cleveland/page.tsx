import React from 'react';
import { Metadata } from 'next';
import { fetchAllCommunities } from '@/lib/fetch-community';
import MemoryCareClevelandClient from './MemoryCareClevelandClient';

export const metadata: Metadata = {
  title: 'Memory Care in Cleveland, Ohio | Alzheimer\'s & Dementia Care | Guide for Seniors',
  description: 'Find specialized memory care communities in Cleveland for Alzheimer\'s and dementia care. Expert guidance, secure environments, and compassionate support.',
};

// ISR: Revalidate every hour
export const revalidate = 3600;

export default async function MemoryCareClevelandPage() {
  // Fetch live community data from Supabase
  const communityData = await fetchAllCommunities();
  
  // Filter for Cleveland-area memory care communities
  const clevelandCities = ['Cleveland', 'Shaker Heights', 'Beachwood', 'Parma', 'Lakewood', 'Westlake', 'Strongsville', 'Independence', 'Seven Hills', 'Rocky River'];
  const memoryCareCommunities = communityData.filter(c => 
    c.careTypes.includes('Memory Care') &&
    clevelandCities.some(city => c.location.toLowerCase().includes(city.toLowerCase()))
  ).slice(0, 8);

  return <MemoryCareClevelandClient communities={memoryCareCommunities} />;
}
