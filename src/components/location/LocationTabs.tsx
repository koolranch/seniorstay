"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { facilityData } from '@/data/facilities';

// Get unique locations from facility data
const getUniqueLocations = () => {
  // Extract city names from facility locations
  const cities = facilityData.map(facility => {
    const cityPart = facility.location.split(',')[0].trim();
    return cityPart;
  });

  // Get unique city names
  const uniqueCities = Array.from(new Set(cities));

  // Sort alphabetically, but put Cleveland first
  return uniqueCities.sort((a, b) => {
    if (a === 'Cleveland') return -1;
    if (b === 'Cleveland') return 1;
    return a.localeCompare(b);
  });
};

// Create location data for the tabs
const getLocationTabs = () => {
  const cities = getUniqueLocations();

  // Add an "All Locations" option at the beginning
  return [
    { id: 'all', label: 'All Locations' },
    ...cities.map(city => ({ id: city.toLowerCase().replace(/\s+/g, '-'), label: city }))
  ];
};

const locations = getLocationTabs();

interface LocationTabsProps {
  onLocationChange?: (location: string) => void;
  selectedLocation?: string;
}

const LocationTabs: React.FC<LocationTabsProps> = ({
  onLocationChange = () => {},
  selectedLocation = 'all'
}) => {

  const handleValueChange = (value: string) => {
    onLocationChange(value);
  };

  return (
    <div className="relative bg-white border-t border-gray-100">
      <div className="container px-0 mx-auto">
        <div className="relative flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-3 z-10 rounded-full shadow-md border border-gray-200 h-7 w-7 hidden md:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="w-full overflow-hidden">
            <Tabs
              value={selectedLocation}
              onValueChange={handleValueChange}
              className="relative w-full"
            >
              <TabsList className="flex w-full h-full px-4 py-3 justify-start overflow-x-auto scrollbar-hide space-x-6 bg-transparent">
                {locations.map((location) => (
                  <TabsTrigger
                    key={location.id}
                    value={location.id}
                    className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-primary data-[state=active]:text-white data-[state=active]:bg-primary rounded-full bg-gray-100 data-[state=active]:bg-primary/90"
                  >
                    {location.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-3 z-10 rounded-full shadow-md border border-gray-200 h-7 w-7 hidden md:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default LocationTabs;
