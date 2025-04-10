"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiCheck, FiMapPin, FiHome, FiUsers, FiCalendar, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { useComparison } from '@/context/ComparisonContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FavoriteButton from './FavoriteButton';
import { getCommunityPath, getCityPath } from '@/lib/utils/formatSlug';

interface ProviderCardProps {
  id: number;
  slug: string;
  name: string;
  type: string;
  image: string;
  rating: number;
  reviewCount?: number; // Changed to optional
  city: string;
  state: string;
  price?: number; // Changed to optional
  distance?: string; // Added
  isFeatured?: boolean; // Added
  amenities?: string[];
  onScheduleTour?: () => void;
  onRequestPricing?: () => void; // Added for pricing requests
  compact?: boolean;
  className?: string;
}

const ProviderCard = ({
  id,
  slug,
  name,
  type,
  image,
  rating,
  reviewCount = 0,
  city,
  state,
  price = 0,
  amenities = [],
  onScheduleTour,
  onRequestPricing,
  compact = false,
  className = '',
}: ProviderCardProps) => {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const inComparison = isInComparison(id);
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Get 3 amenities to display
  const displayAmenities = amenities.slice(0, 3);

  // Generate paths using utility functions
  const communityPath = getCommunityPath(state, city, slug);
  const cityPath = getCityPath(state, city);

  // Handle tour schedule button click
  const handleScheduleTour = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onScheduleTour) {
      onScheduleTour();
    }
  };

  // Handle pricing request button click
  const handleRequestPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRequestPricing) {
      onRequestPricing();
    }
  };

  return (
    <article className={`rounded-2xl shadow-md hover:ring-2 hover:ring-primary transition-all p-4 bg-white ${className}`}>
      <Link
        href={communityPath}
        className="block"
        aria-label={`View details for ${name} in ${city}, ${state}`}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-4">
          <Image
            src={image}
            alt={`Front exterior of ${name} senior living community in ${city}, ${state}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover"
            priority
          />

          {/* Favorite button */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton
              providerId={id}
              providerName={name}
              size={isMobile ? 20 : 18}
            />
          </div>

          {/* Type badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-[#1b4d70]">
            {type}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Name and rating */}
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-[#1b4d70] line-clamp-2">{name}</h3>
            {rating > 0 && (
              <div className="flex items-center bg-[#f1f6f0] px-2 py-1 rounded-md text-sm">
                <FiStar className="text-yellow-400 mr-1" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                {reviewCount > 0 && (
                  <span className="text-gray-500 ml-1">({reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm">
            <FiMapPin className="mr-1 text-[#1b4d70]" />
            <span>{city}, {state}</span>
          </div>

          {/* Amenities */}
          {displayAmenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {displayAmenities.map((amenity, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-700"
                >
                  <FiCheck className="mr-1 text-green-600" />
                  <span className="line-clamp-1">{amenity}</span>
                </div>
              ))}
            </div>
          )}

          {/* City link */}
          <div className="pt-2">
            <Link 
              href={cityPath}
              className="inline-flex items-center text-sm text-[#1b4d70] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              See all communities in {city}
              <FiArrowRight className="ml-1" />
            </Link>
          </div>
        </div>
      </Link>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={handleScheduleTour}
          className="w-full bg-[#1b4d70] text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-[#2F5061] transition-colors flex items-center justify-center"
        >
          <FiCalendar className="mr-2" />
          Schedule Tour
        </button>
        <button
          onClick={handleRequestPricing}
          className="w-full bg-white border border-[#1b4d70] text-[#1b4d70] py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <FiDollarSign className="mr-2" />
          Request Pricing
        </button>
      </div>
    </article>
  );
};

export default ProviderCard;
