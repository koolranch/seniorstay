"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Community } from '@/data/facilities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyGrid from '@/components/property/PropertyGrid';

// Define a map of filter IDs to their corresponding care types in the facility data
// Prioritize Assisted Living and Memory Care first, deprioritize Skilled Nursing
export const CARE_TYPE_FILTERS = [
  { value: 'all', label: 'All Options' },
  { value: 'assisted living', label: 'Assisted Living' },
  { value: 'memory care', label: 'Memory Care' },
  { value: 'independent living', label: 'Independent Living' },
  { value: 'senior apartments', label: 'Senior Apartments' },
  { value: 'ccrc', label: 'CCRCs' },
  { value: 'respite care', label: 'Respite Care' },
  { value: 'hospice', label: 'Hospice' },
  { value: 'nursing homes', label: 'Nursing Homes' },
  { value: 'pet friendly', label: 'Pet Friendly' },
];

// Category data with icons for senior living
// Prioritize AL/MC, deprioritize skilled nursing
const categories = [
  { id: 'all', label: 'All Options', icon: '👨‍👩‍👧‍👦' },
  { id: 'assisted living', label: 'Assisted Living', icon: '👨‍⚕️' },
  { id: 'memory care', label: 'Memory Care', icon: '❤️' },
  { id: 'independent living', label: 'Independent Living', icon: '🏠' },
  { id: 'senior apartments', label: 'Senior Apartments', icon: '🏢' },
  { id: 'ccrc', label: 'CCRCs', icon: '🏘️' },
  { id: 'respite care', label: 'Respite Care', icon: '⏱️' },
  { id: 'hospice', label: 'Hospice', icon: '🙏' },
  { id: 'nursing homes', label: 'Nursing Homes', icon: '🏥' },
  { id: 'pet friendly', label: 'Pet Friendly', icon: '🐶' },
];

interface CategoryTabsProps {
  communities: Community[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
}

export default function CategoryTabs({ communities, selectedFilter = 'all', onFilterChange }: CategoryTabsProps) {
  // Get all care types and sort them: Assisted Living, Memory Care first, then others, Skilled Nursing last
  const allCareTypes = Array.from(new Set(communities.flatMap(community => community.careTypes)));
  
  const sortedCareTypes = allCareTypes.sort((a, b) => {
    // Priority order
    const priority: {[key: string]: number} = {
      'Assisted Living': 1,
      'Memory Care': 2,
      'Independent Living': 3,
      'Skilled Nursing': 99, // Last
    };
    
    const aPriority = priority[a] || 50;
    const bPriority = priority[b] || 50;
    
    return aPriority - bPriority;
  });
  
  const careTypes = ['all', ...sortedCareTypes];

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
