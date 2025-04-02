"use client";

import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  onFilterChange?: (filter: string) => void;
  selectedFilter?: string;
}

const CategoryTabs = ({
  onFilterChange = () => {},
  selectedFilter = 'all'
}: CategoryTabsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration fix - only show scroll buttons after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleValueChange = (value: string) => {
    onFilterChange(value);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Care Type Tabs */}
      <div className="relative">
        <div className="container px-0 mx-auto">
          <div className="relative flex items-center">
            {/* Left scroll button - only show after mount */}
            {isMounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={scrollLeft}
                className="absolute left-1 sm:left-3 z-10 rounded-full shadow-md border border-gray-200 h-7 w-7 flex items-center justify-center bg-white/90"
                aria-label="Scroll left"
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            <div className="w-full overflow-hidden">
              <Tabs
                value={selectedFilter}
                onValueChange={handleValueChange}
                className="relative w-full"
              >
                <TabsList
                  ref={scrollContainerRef}
                  className="flex w-full h-full px-10 sm:px-12 py-3 justify-start overflow-x-auto scrollbar-hide space-x-7 sm:space-x-10 bg-transparent snap-x snap-mandatory scroll-smooth tap-transparent"
                >
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex flex-col items-center justify-center space-y-1 px-2 sm:px-3 py-3 text-xs font-medium text-gray-500 hover:text-primary data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent snap-start min-w-[70px] touch-manipulation"
                    >
                      <span className="text-xl sm:text-2xl">{category.icon}</span>
                      <span className="whitespace-nowrap text-[10px] sm:text-xs">{category.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Right scroll button - only show after mount */}
            {isMounted && (
              <Button
                variant="outline"
                size="icon"
                onClick={scrollRight}
                className="absolute right-1 sm:right-3 z-10 rounded-full shadow-md border border-gray-200 h-7 w-7 flex items-center justify-center bg-white/90"
                aria-label="Scroll right"
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}

            {/* Gradient fade effects */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
