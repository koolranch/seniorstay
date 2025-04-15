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
  slug?: string;
  name: string;
  type: string;
  image: string;
  rating: number;
  reviewCount?: number;
  city?: string;
  state: string;
  price?: number;
  distance?: string;
  isFeatured?: boolean;
  amenities?: string[];
  onScheduleTour?: () => void;
  onRequestPricing?: () => void;
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
  distance,
  isFeatured,
  amenities = [],
  onScheduleTour,
  onRequestPricing,
  compact = false,
  className = '',
}: ProviderCardProps) => {
  console.log('Rendering ProviderCard:', { id, name, city, slug, state });

  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const inComparison = isInComparison(id);
  const isMobile = useMediaQuery('(max-width: 640px)');

  const displayAmenities = amenities.slice(0, 3);

  const hasRequiredData = city && slug && state;

  const communityPath = hasRequiredData ? getCommunityPath(state, city, slug) : '#';
  const cityPath = hasRequiredData ? getCityPath(state, city) : '#';

  const handleScheduleTour = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onScheduleTour) {
      onScheduleTour();
    }
  };

  const handleRequestPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRequestPricing) {
      onRequestPricing();
    }
  };

  const cardContent = (
    <>
      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-4">
        <Image
          src={image}
          alt={`Front exterior of ${name} senior living community in ${city || 'Unknown City'}, ${state || 'Unknown State'}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="object-cover"
          priority
        />

        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            providerId={id}
            providerName={name}
            size={isMobile ? 20 : 18}
          />
        </div>

        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-[#1b4d70]">
          {type}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-[#1b4d70] line-clamp-2">{name}</h3>
          {rating > 0 && (
            <div className="flex items-center bg-[#f1f6f0] px-2 py-1 rounded-md text-sm">
              <FiStar className="text-yellow-400 mr-1 drop-shadow-sm" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              {reviewCount > 0 && (
                <span className="text-gray-500 ml-1">({reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {!hasRequiredData && (
          <p className="text-red-500 text-xs mt-1">⚠ Missing required data (city/slug)</p>
        )}

        <div className="flex items-center text-gray-600 text-sm">
          <FiMapPin className="mr-1 text-[#1b4d70]" />
          <span>{city || 'N/A'}, {state || 'N/A'}</span>
        </div>

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

        {hasRequiredData && (
          <div className="pt-2">
            <Link
              href={cityPath}
              className="inline-flex items-center text-sm text-[#1b4d70] hover:underline"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              See all communities in {city}
              <FiArrowRight className="ml-1" />
            </Link>
          </div>
        )}
      </div>
    </>
  );

  return (
    <article className={`flex flex-col justify-between h-full p-4 bg-white shadow rounded-md min-h-[380px] ${className} ${!hasRequiredData ? 'cursor-not-allowed' : 'hover:ring-2 hover:ring-primary transition-all'}`}>
      <div>
        {hasRequiredData ? (
          <Link
            href={communityPath}
            className="block"
            aria-label={`View details for ${name} in ${city}, ${state}`}
          >
            {cardContent}
          </Link>
        ) : (
          <div aria-label={`Details unavailable for ${name}`}>
            {cardContent}
          </div>
        )}
      </div>

      <div className="mt-auto flex gap-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
          onClick={() => window.open('https://formspree.io/f/xnnpaply', '_blank')}
        >
          Schedule Tour
        </button>
        <button
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition w-full"
          onClick={() => window.open('https://formspree.io/f/xnnpaply', '_blank')}
        >
          Get Pricing
        </button>
      </div>
    </article>
  );
};

export default ProviderCard;
