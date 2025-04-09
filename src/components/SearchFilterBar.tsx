"use client";

import type React from 'react';
import { useState } from 'react';
import {
  FiFilter,
  FiMapPin,
  FiDollarSign,
  FiHome,
  FiStar,
  FiChevronDown,
  FiX
} from 'react-icons/fi';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import MobileFilterDrawer from './MobileFilterDrawer';

// Define available care type options
const CARE_TYPES = [
  { id: 'independent', label: 'Independent Living' },
  { id: 'assisted', label: 'Assisted Living' },
  { id: 'memory', label: 'Memory Care' },
  { id: 'skilled', label: 'Skilled Nursing' },
  { id: 'continuing', label: 'Continuing Care' },
  { id: '55plus', label: '55+ Communities' },
];

// Define amenities options
const AMENITIES = [
  { id: 'dining', label: 'Restaurant-Style Dining' },
  { id: 'fitness', label: 'Fitness Center' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'activities', label: 'Planned Activities' },
  { id: 'transportation', label: 'Transportation Services' },
  { id: 'pets', label: 'Pet Friendly' },
  { id: 'housekeeping', label: 'Housekeeping' },
  { id: 'beauty', label: 'Beauty Salon' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'garden', label: 'Garden/Courtyard' },
];

interface SearchFilterBarProps {
  onFilterChange?: (filters: {
    location: string;
    careTypes: string[];
    amenities: string[];
    priceRange: [number, number];
    rating: number;
  }) => void;
  className?: string;
}

const SearchFilterBar = ({ onFilterChange, className = '' }: SearchFilterBarProps) => {
  // State for each filter
  const [location, setLocation] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedCareTypes, setSelectedCareTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([2000, 6000]);
  const [rating, setRating] = useState<number>(0);

  // Mobile drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Toggle dropdown visibility
  const toggleDropdown = (dropdown: string) => {
    if (isMobile && (dropdown === 'careType' || dropdown === 'amenities')) {
      setMobileFilterOpen(true);
      return;
    }
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Handle care type selection
  const handleCareTypeToggle = (typeId: string) => {
    setSelectedCareTypes(prev => {
      const newSelection = prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId];

      // Notify parent component if callback exists
      if (onFilterChange) {
        onFilterChange({
          location,
          careTypes: newSelection,
          amenities: selectedAmenities,
          priceRange,
          rating
        });
      }

      return newSelection;
    });
  };

  // Handle amenity selection
  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities(prev => {
      const newSelection = prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId];

      // Notify parent component if callback exists
      if (onFilterChange) {
        onFilterChange({
          location,
          careTypes: selectedCareTypes,
          amenities: newSelection,
          priceRange,
          rating
        });
      }

      return newSelection;
    });
  };

  // Handle location change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocation(newLocation);

    if (onFilterChange) {
      onFilterChange({
        location: newLocation,
        careTypes: selectedCareTypes,
        amenities: selectedAmenities,
        priceRange,
        rating
      });
    }
  };

  // Handle price range change
  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);

    if (onFilterChange) {
      onFilterChange({
        location,
        careTypes: selectedCareTypes,
        amenities: selectedAmenities,
        priceRange: newRange,
        rating
      });
    }
  };

  // Handle clear all filters
  const clearAllFilters = () => {
    setLocation('');
    setSelectedCareTypes([]);
    setSelectedAmenities([]);
    setPriceRange([2000, 6000]);
    setRating(0);

    if (onFilterChange) {
      onFilterChange({
        location: '',
        careTypes: [],
        amenities: [],
        priceRange: [2000, 6000],
        rating: 0
      });
    }
  };

  // Apply filters (for mobile drawer)
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        location,
        careTypes: selectedCareTypes,
        amenities: selectedAmenities,
        priceRange,
        rating
      });
    }
  };

  // Calculate active filter count
  const activeFilterCount = [
    location ? 1 : 0,
    selectedCareTypes.length,
    selectedAmenities.length,
    rating > 0 ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <>
      <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {/* Location Filter */}
          <div className="relative w-full sm:min-w-[200px] sm:flex-grow">
            <div className="flex items-center border rounded-lg bg-[#f1f6f0] px-3 py-2">
              <FiMapPin className="text-[#1b4d70] mr-2" />
              <input
                type="text"
                className="bg-transparent w-full outline-none"
                placeholder="Location"
                value={location}
                onChange={handleLocationChange}
              />
            </div>
          </div>

          {/* Mobile Filter Button */}
          {isMobile ? (
            <button
              className="flex items-center justify-center border rounded-lg px-3 py-2 w-full bg-[#1b4d70] text-white"
              onClick={() => setMobileFilterOpen(true)}
              aria-expanded={mobileFilterOpen}
              aria-label="Open filters"
            >
              <FiFilter className="mr-2" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-white text-[#1b4d70] text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          ) : (
            // Desktop Filter Buttons
            <>
              {/* Care Type Filter */}
              <div className="relative">
                <button
                  className="flex items-center justify-between border rounded-lg px-3 py-2 w-full sm:w-auto min-w-[140px]"
                  onClick={() => toggleDropdown('careType')}
                  aria-expanded={activeDropdown === 'careType'}
                >
                  <div className="flex items-center">
                    <FiHome className="text-[#1b4d70] mr-2" />
                    <span>
                      Care Type
                      {selectedCareTypes.length > 0 && ` (${selectedCareTypes.length})`}
                    </span>
                  </div>
                  <FiChevronDown className={`ml-2 transition-transform ${activeDropdown === 'careType' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'careType' && (
                  <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg p-3 w-64 max-h-80 overflow-y-auto">
                    <div className="space-y-2">
                      {CARE_TYPES.map(type => (
                        <label key={type.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-[#f1f6f0] rounded">
                          <input
                            type="checkbox"
                            checked={selectedCareTypes.includes(type.id)}
                            onChange={() => handleCareTypeToggle(type.id)}
                            className="h-4 w-4 text-[#1b4d70] rounded"
                          />
                          <span>{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities Filter */}
              <div className="relative">
                <button
                  className="flex items-center justify-between border rounded-lg px-3 py-2 w-full sm:w-auto min-w-[140px]"
                  onClick={() => toggleDropdown('amenities')}
                  aria-expanded={activeDropdown === 'amenities'}
                >
                  <div className="flex items-center">
                    <FiStar className="text-[#1b4d70] mr-2" />
                    <span>
                      Amenities
                      {selectedAmenities.length > 0 && ` (${selectedAmenities.length})`}
                    </span>
                  </div>
                  <FiChevronDown className={`ml-2 transition-transform ${activeDropdown === 'amenities' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'amenities' && (
                  <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg p-3 w-64 max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-2">
                      {AMENITIES.map(amenity => (
                        <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-[#f1f6f0] rounded">
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity.id)}
                            onChange={() => handleAmenityToggle(amenity.id)}
                            className="h-4 w-4 text-[#1b4d70] rounded"
                          />
                          <span>{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* All Filters Button */}
              <button
                className="flex items-center border rounded-lg px-3 py-2"
                onClick={() => toggleDropdown('allFilters')}
              >
                <FiFilter className="text-[#1b4d70] mr-2" />
                <span>All Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-[#1b4d70] text-white text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Clear Filters (only show if filters are active) */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center text-[#1b4d70] hover:text-[#F5A623] px-2"
                >
                  <FiX className="mr-1" />
                  <span>Clear all</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Advanced filter panel - Desktop Only */}
        {!isMobile && activeDropdown === 'allFilters' && (
          <div className="mt-4 p-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Care Types Section */}
              <div>
                <h3 className="font-medium mb-3 text-[#1b4d70]">Care Type</h3>
                <div className="space-y-2">
                  {CARE_TYPES.map(type => (
                    <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCareTypes.includes(type.id)}
                        onChange={() => handleCareTypeToggle(type.id)}
                        className="h-4 w-4 text-[#1b4d70] rounded"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities Section */}
              <div>
                <h3 className="font-medium mb-3 text-[#1b4d70]">Amenities</h3>
                <div className="space-y-2">
                  {AMENITIES.slice(0, 6).map(amenity => (
                    <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="h-4 w-4 text-[#1b4d70] rounded"
                      />
                      <span>{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* More Amenities */}
              <div>
                <h3 className="font-medium mb-3 text-[#1b4d70]">More Amenities</h3>
                <div className="space-y-2">
                  {AMENITIES.slice(6).map(amenity => (
                    <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="h-4 w-4 text-[#1b4d70] rounded"
                      />
                      <span>{amenity.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setActiveDropdown(null)}
                className="bg-[#1b4d70] text-white py-2 px-4 rounded-lg hover:bg-[#2F5061] transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        selectedCareTypes={selectedCareTypes}
        selectedAmenities={selectedAmenities}
        priceRange={priceRange}
        onCareTypeToggle={handleCareTypeToggle}
        onAmenityToggle={handleAmenityToggle}
        onPriceRangeChange={handlePriceRangeChange}
        onApplyFilters={applyFilters}
        onClearFilters={clearAllFilters}
      />
    </>
  );
};

export default SearchFilterBar;
