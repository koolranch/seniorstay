"use client";

import React from 'react';
import { communityData } from '@/data/facilities';
import { notFound } from 'next/navigation';
import LocationHeader from '@/components/location/LocationHeader';
import LocationTabs from '@/components/location/LocationTabs';
import LocationStats from '@/components/location/LocationStats';
import LocationMap from '@/components/location/LocationMap';
import LocationCommunities from '@/components/location/LocationCommunities';
import LocationFAQ from '@/components/location/LocationFAQ';
import SchemaOrg from './SchemaOrg';
import type { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

interface LocationPageProps {
  params: Params;
}

export default function LocationPage({ params }: LocationPageProps) {
  const { city } = params as { city: string };
  const decodedCity = decodeURIComponent(city);

  // Filter communities by city
  const communities = communityData.filter(
    community => community.location.split(',')[0].trim() === decodedCity
  );

  if (communities.length === 0) {
    notFound();
  }

  // Get state abbreviation from the first community
  const stateAbbr = communities[0].location.split(',')[1]?.trim() || 'OH';

  return (
    <div className="min-h-screen bg-gray-50">
      <LocationHeader city={decodedCity} state={stateAbbr} />
      <div className="container mx-auto px-4 py-8">
        <LocationStats communities={communities} />
        <LocationMap communities={communities} />
        <LocationCommunities communities={communities} />
        <LocationFAQ />
      </div>
      <SchemaOrg
        cityName={decodedCity}
        stateAbbr={stateAbbr}
        communities={communities}
      />
    </div>
  );
}
