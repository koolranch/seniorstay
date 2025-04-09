"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiCheck, FiMapPin, FiHome, FiUsers, FiCalendar } from 'react-icons/fi';
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
  reviewCount = 0, // Default value for reviewCount
  city,
  state,
  price = 0, // Default value for price
  amenities = [],
  onScheduleTour,
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

  return (
    <Link
      href={`/provider/${slug}`}
      className={`group relative flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="object-cover"
          priority
        />

        {/* Replace save button with FavoriteButton */}
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
      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-lg text-[#1b4d70] line-clamp-1">{name}</h3>

          {/* Rating */}
          <div className="flex items-center">
            <FiStar className="text-[#F5A623] fill-[#F5A623]" />
            <span className="ml-1 font-medium text-sm">{rating}</span>
            <span className="text-gray-400 text-xs ml-1">({reviewCount})</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <FiMapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="truncate">{city}, {state}</span>
        </div>

        {!compact && (
          <>
            {/* Amenities */}
            {displayAmenities.length > 0 && (
              <div className="mt-2 space-y-1">
                {displayAmenities.map((amenity, index) => (
                  <div key={`${id}-${amenity}`} className="flex items-center text-xs text-[#333333]">
                    <FiCheck size={12} className="text-[#A7C4A0] mr-1" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bottom actions */}
        <div className="mt-auto pt-3">
          {onScheduleTour && (
            <button
              onClick={handleScheduleTour}
              className="w-full mt-2 bg-[#1b4d70] text-white py-2.5 px-4 rounded-lg hover:bg-[#2F5061] transition flex items-center justify-center font-medium"
            >
              <FiCalendar className="mr-2" />
              {isMobile ? 'Schedule Tour' : 'Schedule a Tour'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile quick actions - Bottom bar */}
      {isMobile && !compact && (
        <div className="flex items-center justify-center bg-[#f1f6f0] border-t border-[#A7C4A0] p-2">
          <div className="flex items-center text-[#1b4d70] text-sm">
            <FiHome className="mr-1" />
            <span className="font-semibold">
              {type.split(' ')[0]}
            </span>
          </div>
        </div>
      )}
    </Link>
  );
};

export default ProviderCard;
