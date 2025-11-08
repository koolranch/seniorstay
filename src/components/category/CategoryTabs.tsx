"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Community } from '@/data/facilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyGrid from '@/components/property/PropertyGrid';

// Define a map of filter IDs to their corresponding care types in the facility data
export const CARE_TYPE_FILTERS = [
  { value: 'all', label: 'All Options' },
  { value: 'independent living', label: 'Independent Living' },
  { value: 'assisted living', label: 'Assisted Living' },
  { value: 'memory care', label: 'Memory Care' },
  { value: 'nursing homes', label: 'Nursing Homes' },
  { value: 'senior apartments', label: 'Senior Apartments' },
  { value: 'ccrc', label: 'CCRCs' },
  { value: 'respite care', label: 'Respite Care' },
  { value: 'hospice', label: 'Hospice' },
  { value: 'pet friendly', label: 'Pet Friendly' },
];

// Category data with icons for senior living
const categories = [
  { id: 'all', label: 'All Options', icon: '👨‍👩‍👧‍👦' },
  { id: 'independent living', label: 'Independent Living', icon: '🏠' },
  { id: 'assisted living', label: 'Assisted Living', icon: '👨‍⚕️' },
  { id: 'memory care', label: 'Memory Care', icon: '❤️' }, // Updated icon for Memory Care
  { id: 'nursing homes', label: 'Nursing Homes', icon: '🏥' },
  { id: 'senior apartments', label: 'Senior Apartments', icon: '🏢' },
  { id: 'ccrc', label: 'CCRCs', icon: '🏘️' },
  { id: 'respite care', label: 'Respite Care', icon: '⏱️' },
  { id: 'hospice', label: 'Hospice', icon: '🙏' },
  { id: 'pet friendly', label: 'Pet Friendly', icon: '🐶' },
];

interface CategoryTabsProps {
  communities: Community[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
}

export default function CategoryTabs({ communities, selectedFilter = 'all', onFilterChange }: CategoryTabsProps) {
  // Filter to show only primary care types (exclude Skilled Nursing and Rehabilitation)
  const allCareTypes = Array.from(new Set(communities.flatMap(community => community.careTypes)));
  const primaryCareTypes = allCareTypes.filter(type => 
    type !== 'Skilled Nursing' && type !== 'Rehabilitation'
  );
  const careTypes = ['all', ...primaryCareTypes];

  return (
    <Tabs value={selectedFilter} onValueChange={onFilterChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        {careTypes.map((type) => (
          <TabsTrigger key={type} value={type}>
            {type === 'all' ? 'All Options' : type}
          </TabsTrigger>
        ))}
      </TabsList>
      {careTypes.map((type) => (
        <TabsContent key={type} value={type}>
          <PropertyGrid
            communities={type === 'all' ? communities : communities.filter(community => community.careTypes.includes(type))}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
