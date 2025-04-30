"use client";

import React from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiStar, FiCheck } from 'react-icons/fi';
import { Calendar, DollarSign } from 'lucide-react';
import { getCityPath } from '@/lib/utils/formatSlug';
import { sendGAEvent } from '@/lib/utils/gtag';

interface CommunityCardProps {
  community: {
    id?: number;
    name: string;
    type: string;
    description: string;
    address: string;
    city: string;
    state: string;
    amenities?: string[];
    rating?: number;
    reviewCount?: number;
    image?: string;
  };
  showDetails?: boolean;
  showRequestButton?: boolean;
}

export default function CommunityCard({ 
  community, 
  showDetails = false,
  showRequestButton = false
}: CommunityCardProps) {
  // Format city name for display
  const cityName = community.city.split(/[-_]/).map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  // Handle tour schedule button click
  const handleScheduleTour = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sendGAEvent('schedule_tour_click', community.name);
    // Implementation would go here
    console.log('Schedule tour for:', community.name);
  };

  // Handle pricing request button click
  const handleRequestPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sendGAEvent('get_pricing_click', community.name);
    // Implementation would go here
    console.log('Request pricing for:', community.name);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col justify-between">
      {/* Back Link */}
      <div className="p-6 pb-0">
        <Link 
          href={getCityPath("OH", cityName)}
          className="inline-flex items-center text-[#1b4d70] mb-6 hover:underline"
        >
          <FiArrowLeft className="mr-2" />
          Back to {cityName} Communities
        </Link>
      </div>

      {/* Community Header */}
      <div className="p-6 pb-4">
        <h1 className="text-3xl font-bold text-[#1b4d70] mb-2">
          {community.name}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {community.type} in {cityName}, {community.state}
        </p>

        {/* Rating display if available */}
        {community.rating && community.rating > 0 && (
          <div className="flex items-center mb-4">
            <div className="flex items-center bg-[#f1f6f0] px-2 py-1 rounded-md text-sm">
              <FiStar className="text-yellow-400 mr-1 drop-shadow-sm" />
              <span className="font-semibold" aria-label={`Rated ${community.rating.toFixed(1)} out of 5`}>{community.rating.toFixed(1)}</span>
              {community.reviewCount && community.reviewCount > 0 && (
                <span className="text-gray-500 ml-1">({community.reviewCount} reviews)</span>
              )}
            </div>
            
            {community.rating >= 4.8 && (
              <div className="ml-3 flex items-center bg-yellow-200 px-2 py-1 rounded-md text-xs font-semibold text-yellow-800 shadow-sm">
                <FiStar className="text-yellow-600 mr-1" size={12} />
                Featured
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        {/* About Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#1b4d70] mb-3">
            About {community.name}
          </h2>
          <p className="text-gray-600 mb-4">
            {community.description}
          </p>
          <div className="flex items-center text-gray-600">
            <span className="mr-2">Address:</span>
            <span>{community.address}, {cityName}, {community.state}</span>
          </div>
        </div>

        {/* Amenities */}
        {community.amenities && community.amenities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1b4d70] mb-3">
              Amenities & Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {community.amenities.map((amenity, index) => (
                <div 
                  key={index}
                  className="flex items-center text-gray-600"
                >
                  <FiCheck className="mr-2 text-green-600" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {showRequestButton && (
          <div className="mt-auto flex flex-col sm:flex-row gap-2 pt-4">
            <button
              onClick={handleScheduleTour}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full shadow-sm transition inline-flex items-center justify-center"
            >
              <Calendar className="w-4 h-4 inline-block mr-1 -mt-0.5" />
              Book a Free Tour
            </button>
            <button
              onClick={handleRequestPricing}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium py-2 px-4 rounded-full transition inline-flex items-center justify-center"
            >
              <DollarSign className="w-4 h-4 inline-block mr-1 -mt-0.5" />
              See Your Customized Pricing
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 