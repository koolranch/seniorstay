"use client";

import React, { useState, useEffect } from 'react';
import { FiMap, FiList, FiX, FiMaximize, FiMinimize } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Dynamically import the map component to avoid SSR issues with map libraries
const DynamicMap = dynamic(() => import('./map/GoogleMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="animate-pulse text-[#1b4d70]">Loading map...</div>
    </div>
  ),
});

interface MapToggleViewProps {
  providers: Array<{
    id: number;
    slug: string;
    name: string;
    lat?: number;
    lng?: number;
    city: string;
    state: string;
  }>;
  className?: string;
  defaultView?: 'list' | 'map' | 'split';
  onViewChange?: (view: 'list' | 'map' | 'split') => void;
}

const MapToggleView = ({
  providers,
  className = '',
  defaultView = 'list',
  onViewChange,
}: MapToggleViewProps) => {
  const [view, setView] = useState<'list' | 'map' | 'split'>(defaultView);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Use mobile view on mobile devices - no split view
  useEffect(() => {
    if (isMobile && view === 'split') {
      setView('list');
    }
  }, [isMobile, view]);

  // Handle view change
  const handleViewChange = (newView: 'list' | 'map' | 'split') => {
    // Prevent split view on mobile
    let finalView = newView;
    if (isMobile && finalView === 'split') {
      finalView = 'map';
    }

    setView(finalView);
    if (onViewChange) {
      onViewChange(finalView);
    }
  };

  // Toggle fullscreen map view on mobile
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Generate map markers from providers
  const mapMarkers = providers.map(provider => ({
    id: provider.id,
    position: {
      lat: provider.lat || 40.7128, // Default to NYC if no coordinates
      lng: provider.lng || -74.0060
    },
    title: provider.name,
    link: `/provider/${provider.slug}`
  }));

  return (
    <div className={`relative ${className}`}>
      {/* Toggle buttons - Desktop */}
      {!isMobile && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-md">
          <div className="flex p-1">
            <button
              type="button"
              onClick={() => handleViewChange('list')}
              className={`flex items-center px-3 py-2 rounded-lg ${
                view === 'list' ? 'bg-[#1b4d70] text-white' : 'text-[#333333] hover:bg-gray-100'
              }`}
              aria-label="Show as list"
            >
              <FiList className="mr-2" />
              <span className="text-sm font-medium font-semibold">List</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewChange('split')}
              className={`flex items-center px-3 py-2 mx-1 rounded-lg ${
                view === 'split' ? 'bg-[#1b4d70] text-white' : 'text-[#333333] hover:bg-gray-100'
              }`}
              aria-label="Show split view"
            >
              <span className="text-sm font-medium font-semibold">Split</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewChange('map')}
              className={`flex items-center px-3 py-2 rounded-lg ${
                view === 'map' ? 'bg-[#1b4d70] text-white' : 'text-[#333333] hover:bg-gray-100'
              }`}
              aria-label="Show as map"
            >
              <FiMap className="mr-2" />
              <span className="text-sm font-medium font-semibold">Map</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Map Toggle Buttons - Only show in map view on mobile */}
      {isMobile && view === 'map' && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-md">
          <div className="flex p-1">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex items-center px-3 py-2 rounded-lg text-[#333333] hover:bg-gray-100"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <FiMinimize className="text-[#1b4d70]" size={20} />
              ) : (
                <FiMaximize className="text-[#1b4d70]" size={20} />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleViewChange('list')}
              className="flex items-center px-3 py-2 rounded-lg text-[#333333] hover:bg-gray-100 ml-1"
              aria-label="Back to list"
            >
              <FiX className="text-[#1b4d70]" size={20} />
            </button>
          </div>
        </div>
      )}

      {/* View container */}
      <div
        className={`w-full transition-all duration-300 ease-in-out ${
            view === 'list'
              ? 'h-0'
              : view === 'split'
                  ? 'h-[400px]'
                  : isFullscreen && isMobile
                      ? 'h-[100vh] fixed inset-0 z-30'
                      : 'h-[calc(100vh-200px)]'
        }`}
      >
        {view !== 'list' && (
          <div className="w-full h-full rounded-lg overflow-hidden border border-[#A7C4A0]">
            <DynamicMap markers={mapMarkers} />
          </div>
        )}
      </div>

      {/* Mobile Map Toggle (Fixed to bottom for mobile) */}
      {view === 'list' && isMobile && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={() => handleViewChange('map')}
            className="bg-[#1b4d70] text-white px-4 py-3 rounded-full font-medium font-semibold shadow-lg flex items-center space-x-2 hover:bg-[#2F5061] transition-colors"
          >
            <FiMap className="mr-2" />
            <span>Show map</span>
          </button>
        </div>
      )}

      {/* Mobile Close Map Button */}
      {view === 'map' && isMobile && !isFullscreen && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={() => handleViewChange('list')}
            className="bg-white text-[#1b4d70] border border-[#1b4d70] px-4 py-3 rounded-full font-medium font-semibold shadow-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors"
          >
            <FiList className="mr-2" />
            <span>Show list</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MapToggleView;
