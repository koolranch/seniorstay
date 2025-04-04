"use client";

import React from 'react';
import { communityData } from '@/data/facilities';
import { notFound } from 'next/navigation';
import LocationHeader from '@/components/location/LocationHeader';
import LocationStats from '@/components/location/LocationStats';
import LocationMap from '@/components/location/LocationMap';
import LocationCommunities from '@/components/location/LocationCommunities';
import LocationFAQ from '@/components/location/LocationFAQ';
import SchemaOrg from './SchemaOrg';

export default function LocationPage({ params }: { params: { city: string } }) {
  const { city } = params;
  const decodedCity = decodeURIComponent(city);

  // Filter communities by city
  const communities = communityData.filter(
    community => community.location.split(',')[0].trim() === decodedCity
  );

  if (communities.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LocationHeader city={decodedCity} />
      <div className="container mx-auto px-4 py-8">
        <LocationStats city={decodedCity} />
        <LocationMap city={decodedCity} />
        <LocationCommunities city={decodedCity} communities={communities} />
        <LocationFAQ city={decodedCity} />
      </div>
      <SchemaOrg
        cityName={decodedCity}
        stateAbbr={communities[0].location.split(',')[1]?.trim() || 'OH'}
        communities={communities}
      />
    </div>
  );
}
