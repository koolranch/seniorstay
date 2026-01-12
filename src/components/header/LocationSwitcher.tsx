'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, ChevronDown, Check } from 'lucide-react';
import { REGIONS, getAllRegionSlugs, getRegionConfig, DEFAULT_REGION } from '@/data/regions';

interface LocationSwitcherProps {
  className?: string;
}

/**
 * LocationSwitcher Component
 * Dropdown for switching between supported regions (e.g., Greater Cleveland, Greater Columbus)
 */
const LocationSwitcher: React.FC<LocationSwitcherProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // Get current region from URL path
  const getCurrentRegion = (): string => {
    const regionSlugs = getAllRegionSlugs();
    const pathSegments = pathname.split('/').filter(Boolean);
    
    if (pathSegments.length > 0 && regionSlugs.includes(pathSegments[0])) {
      return pathSegments[0];
    }
    
    return DEFAULT_REGION;
  };
  
  const currentRegion = getCurrentRegion();
  const currentRegionConfig = getRegionConfig(currentRegion);
  const allRegions = getAllRegionSlugs().map(slug => getRegionConfig(slug)).filter(Boolean);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
  
  // Build the target URL for a region switch
  const getRegionUrl = (regionSlug: string): string => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const currentRegionSlugs = getAllRegionSlugs();
    
    // If we're already on a region path, replace the region
    if (pathSegments.length > 0 && currentRegionSlugs.includes(pathSegments[0])) {
      pathSegments[0] = regionSlug;
      return '/' + pathSegments.join('/');
    }
    
    // Otherwise, just go to the region hub
    return `/${regionSlug}`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50 rounded-lg transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MapPin className="h-4 w-4" />
        <span className="hidden sm:inline">{currentRegionConfig?.displayName || 'Select Location'}</span>
        <span className="sm:hidden">{currentRegionConfig?.primaryCity || 'Location'}</span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
          <div className="p-3 bg-slate-50 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Select Region
            </p>
          </div>
          
          <div className="py-2">
            {allRegions.map((region) => {
              if (!region) return null;
              const isActive = region.slug === currentRegion;
              
              return (
                <Link
                  key={region.slug}
                  href={getRegionUrl(region.slug)}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 hover:bg-teal-50 transition-colors ${
                    isActive ? 'bg-teal-50' : ''
                  }`}
                >
                  <div>
                    <p className={`font-medium ${isActive ? 'text-teal-700' : 'text-slate-900'}`}>
                      {region.displayName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {region.primaryCity}, {region.stateAbbr}
                    </p>
                  </div>
                  {isActive && (
                    <Check className="h-5 w-5 text-teal-600" />
                  )}
                </Link>
              );
            })}
          </div>
          
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              More regions coming soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSwitcher;
