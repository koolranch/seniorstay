import React from 'react';
import { notFound } from 'next/navigation';
import CityLocationClient from './CityLocationClient';
import { supabase } from '@/lib/supabase-client';
import { fetchAllCommunities } from '@/lib/fetch-community';
import { Community } from '@/data/facilities';

// Revalidate every 24 hours
export const revalidate = 86400;

// Generate static params for all cities with communities
export async function generateStaticParams() {
  // Use Supabase to get unique cities instead of static file
  // This ensures we catch all cities including new ones
  const { data } = await supabase
    .from('Community')
    .select('city');
    
  if (!data) return [];
  
  // Get unique cities
  const uniqueCities = Array.from(new Set(
    data
      .filter(item => item.city)
      .map(item => item.city.trim())
  ));
  
  return uniqueCities.map((city) => ({
    city: city.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default async function LocationPage({ params }: { params: { city: string } }) {
  const { city } = params;
  
  // Convert slug back to city name for display (approximate)
  // We'll rely on the actual data for precise filtering
  const slugCityName = city.replace(/-/g, ' ').toLowerCase();

  // Fetch all communities and filter on the server
  // This is efficient enough for <1000 records and avoids creating new indexes yet
  const allCommunities = await fetchAllCommunities();
  
  // Filter communities by city (case insensitive)
  const communities = allCommunities.filter(community => {
    if (!community.location) return false;
    const communityCity = community.location.split(',')[0].trim().toLowerCase();
    return communityCity === slugCityName;
  });

  if (communities.length === 0) {
    notFound();
  }

  // Get the proper display name from the first match (e.g. "North Olmsted" instead of "north-olmsted")
  // Or construct it from slug if needed
  const displayCityName = communities[0].location.split(',')[0].trim();

  return (
    <CityLocationClient
      cityName={displayCityName}
      stateAbbr="OH"
      communities={communities}
    />
  );
}
