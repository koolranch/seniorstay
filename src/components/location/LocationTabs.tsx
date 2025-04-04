"use client";

import React from 'react';
import { Community } from '@/data/facilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyGrid from '@/components/property/PropertyGrid';

interface LocationTabsProps {
  communities: Community[];
  selectedLocation?: string;
  onLocationChange?: (value: string) => void;
}

export default function LocationTabs({ communities, selectedLocation = 'all', onLocationChange }: LocationTabsProps) {
  const cities = ['all', ...Array.from(new Set(communities.map(community => 
    community.location.split(',')[0].trim()
  )))];

  return (
    <Tabs value={selectedLocation} onValueChange={onLocationChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        {cities.map((city) => (
          <TabsTrigger key={city} value={city}>
            {city === 'all' ? 'All Locations' : city}
          </TabsTrigger>
        ))}
      </TabsList>
      {cities.map((city) => (
        <TabsContent key={city} value={city}>
          <PropertyGrid
            communities={city === 'all' ? communities : communities.filter(community => 
              community.location.split(',')[0].trim() === city
            )}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
