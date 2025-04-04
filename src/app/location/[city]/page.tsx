"use client";

import React from 'react';
import LocationHeader from '@/components/location/LocationHeader';
import LocationStats from '@/components/location/LocationStats';
import LocationMap from '@/components/location/LocationMap';
import LocationCommunities from '@/components/location/LocationCommunities';
import LocationFAQ from '@/components/location/LocationFAQ';

export default function LocationPage({ params }: { params: { city: string } }) {
  const { city } = params;

  return (
    <div>
      <LocationHeader city={city} />
      <LocationStats city={city} />
      <LocationMap city={city} />
      <LocationCommunities city={city} />
      <LocationFAQ city={city} />
    </div>
  );
}
