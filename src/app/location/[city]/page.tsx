import React from 'react';
import { notFound } from 'next/navigation';
import { facilityData } from '@/data/facilities';
import CityLocationClient from './CityLocationClient';

export async function generateMetadata({ params }: { params: { city: string } }) {
  const decodedCity = decodeURIComponent(params.city);
  const cityParts = decodedCity.split('-');

  // Extract city name and state
  const cityName = cityParts.slice(0, -1).join(' ');
  const stateAbbr = cityParts[cityParts.length - 1];

  // Get communities for this city
  const cityCommunities = facilityData.filter(community => {
    const communityCity = community.location?.split(',')[0]?.trim() || '';
    return communityCity.toLowerCase() === cityName.toLowerCase();
  });

  // If no communities found, use default metadata
  if (cityCommunities.length === 0) {
    return {
      title: 'Location Not Found | Ray Senior Placement',
      description: 'Explore senior living options across Northeast Ohio.',
    };
  }

  return {
    title: `Senior Living in ${cityName}, ${stateAbbr} | Ray Senior Placement`,
    description: `Discover ${cityCommunities.length} senior living communities in ${cityName}, ${stateAbbr}. Find assisted living, memory care, and independent living options.`,
    openGraph: {
      title: `Senior Living in ${cityName}, ${stateAbbr}`,
      description: `Explore ${cityCommunities.length} senior care communities in ${cityName}, ${stateAbbr} including assisted living, memory care, and independent living.`,
      images: ['/images/og-image.jpg'],
    }
  };
}

export default async function CityLocationPage({ params }: { params: { city: string } }) {
  const decodedCity = decodeURIComponent(params.city);
  const cityParts = decodedCity.split('-');

  // Extract city name and state
  const cityName = cityParts.slice(0, -1).join(' ');
  const stateAbbr = cityParts[cityParts.length - 1];

  // Get communities for this city
  const cityCommunities = facilityData.filter(community => {
    const communityCity = community.location?.split(',')[0]?.trim() || '';
    return communityCity.toLowerCase() === cityName.toLowerCase();
  });

  // If no communities found for this city, show 404
  if (cityCommunities.length === 0) {
    notFound();
  }

  return (
    <CityLocationClient
      cityName={cityName}
      stateAbbr={stateAbbr}
      communities={cityCommunities}
    />
  );
}
