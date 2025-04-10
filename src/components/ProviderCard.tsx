"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiCheck, FiMapPin, FiHome, FiUsers, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { useComparison } from '@/context/ComparisonContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FavoriteButton from './FavoriteButton';

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
        href={`/community/${state.toLowerCase()}/${city.toLowerCase()}/${slug}`}
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
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
            {type}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Name and Rating */}
          <div>
            <h2 className="text-xl font-semibold text-[#1b4d70] line-clamp-1">{name}</h2>
            <p className="text-sm text-gray-600 mt-1">{city}, {state}</p>
            <div className="flex items-center mt-2">
              <FiStar className="text-[#F5A623] fill-[#F5A623]" />
              <span className="ml-1 font-medium text-sm">{rating}</span>
              <span className="text-gray-400 text-xs ml-1">({reviewCount} reviews)</span>
            </div>
          </div>

          {/* Service Tags */}
          {!compact && displayAmenities.length > 0 && (
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {displayAmenities.map((amenity) => (
                <li
                  key={`${id}-${amenity}`}
                  className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="mt-4 space-y-2">
        {onScheduleTour && (
          <button
            onClick={handleScheduleTour}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold text-sm flex items-center justify-center"
            aria-label={`Request a tour at ${name}`}
          >
            <FiCalendar className="mr-2" />
            Request a Tour
          </button>
        )}
        
        {onRequestPricing && (
          <button
            onClick={handleRequestPricing}
            className="w-full bg-white border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded font-semibold text-sm flex items-center justify-center"
            aria-label={`Get pricing for ${name}`}
          >
            <FiDollarSign className="mr-2" />
            Get Pricing
          </button>
        )}
      </div>
    </article>
  );
};

export default ProviderCard;
