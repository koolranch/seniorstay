"use client";

import React from 'react';
import { Community } from '@/data/facilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyGrid from '@/components/property/PropertyGrid';

interface LocationTabsProps {
  communities: Community[];
}

export default function LocationTabs({ communities }: LocationTabsProps) {
  const cities = Array.from(new Set(communities.map(community => community.location)));

  return (
    <Tabs defaultValue={cities[0]} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        {cities.map((city) => (
          <TabsTrigger key={city} value={city}>
            {city}
          </TabsTrigger>
        ))}
      </TabsList>
      {cities.map((city) => (
        <TabsContent key={city} value={city}>
          <PropertyGrid
            communities={communities.filter(community => community.location === city)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
