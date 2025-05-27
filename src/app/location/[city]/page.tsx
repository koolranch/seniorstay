import React from 'react';
import { communityData } from '@/data/facilities';
import { notFound } from 'next/navigation';
import CityLocationClient from './CityLocationClient';

// Generate static params for all cities with communities
export async function generateStaticParams() {
  const cities = Array.from(new Set(
    communityData.map(community => 
      community.location.split(',')[0].trim()
    )
  ));
  
  return cities.map((city) => ({
    city: city.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default function LocationPage({ params }: { params: { city: string } }) {
  const { city } = params;
  
  // Convert slug back to city name
  const cityName = city
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Filter communities by city
  const communities = communityData.filter(
    community => community.location.split(',')[0].trim() === cityName
  );

  if (communities.length === 0) {
    notFound();
  }

  return (
    <CityLocationClient
      cityName={cityName}
      stateAbbr="OH"
      communities={communities}
    />
  );
}
