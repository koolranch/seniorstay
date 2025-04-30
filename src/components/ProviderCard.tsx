"use client";

import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiCheck, FiMapPin, FiHome, FiUsers, FiCalendar, FiDollarSign, FiArrowRight, FiSquare, FiCheckSquare } from 'react-icons/fi';
import { useComparison } from '@/context/ComparisonContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FavoriteButton from './FavoriteButton';
import { getCommunityPath, getCityPath } from '@/lib/utils/formatSlug';
import { Calendar, DollarSign } from 'lucide-react';
import { sendGAEvent } from '@/lib/utils/gtag';
import RequestInfoModal from './RequestInfoModal';

// Define a consistent fallback image
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=2070&auto=format&fit=crop";

interface ProviderCardProps {
  id?: string;
  slug: string;
  name: string;
  city: string;
  city_slug?: string;
  state: string;
  amenities?: string[];
  image?: string | null;
  type?: string;
  rating?: number | null;
  reviewCount?: number;
  price?: number;
  distance?: string;
  isFeatured?: boolean;
  onScheduleTour?: () => void;
  onRequestPricing?: () => void;
  compact?: boolean;
  className?: string;
}

const ProviderCard = ({
  id = '',
  slug,
  name,
  type,
  image = '',
  rating,
  reviewCount = 0,
  city,
  city_slug = '',
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRequestType, setModalRequestType] = useState<'Pricing' | 'Tour'>('Pricing');
  const [imageError, setImageError] = useState(false);

  const displayAmenities = amenities.slice(0, 3);

  const hasRequiredData = Boolean(city && slug && state && city_slug);

  // Update communityPath to use only city_slug and slug
  const communityPath = hasRequiredData ? `/ohio/${city_slug}/${slug}` : '#';
  const cityPath = getCityPath(state, city);

  // Use the consistent fallback image instead of random Unsplash image
  const imageSource = (imageError || !image) ? FALLBACK_IMAGE : image;

  const handleScheduleTour = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sendGAEvent('schedule_tour_click', name);
    setModalRequestType('Tour');
    setIsModalOpen(true);
  };

  const handleRequestPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sendGAEvent('get_pricing_click', name);
    setModalRequestType('Pricing');
    setIsModalOpen(true);
  };

  const handleComparisonChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.checked) {
      addToComparison(id);
    } else {
      removeFromComparison(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const cardContent = (
    <>
      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-4 group">
        <label 
          className="absolute top-3 left-3 z-20 cursor-pointer p-1.5 bg-white/80 hover:bg-white rounded-md shadow transition-opacity opacity-0 group-hover:opacity-100 focus-within:opacity-100" 
          onClick={(e) => e.stopPropagation()}
          htmlFor={`compare-${id}`}
        >
          <input
            type="checkbox"
            id={`compare-${id}`}
            checked={inComparison}
            onChange={handleComparisonChange}
            className="hidden"
            aria-label={`Select ${name} for comparison`}
          />
          {inComparison ? (
            <FiCheckSquare size={20} className="text-blue-600" />
          ) : (
            <FiSquare size={20} className="text-gray-500" />
          )}
        </label>

        <Image
          src={imageSource}
          alt={`Front exterior of ${name} senior living community in ${city || 'Unknown City'}, ${state || 'Unknown State'}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="object-cover"
          priority
          onError={() => setImageError(true)}
        />

        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            providerId={id}
            providerName={name}
            size={isMobile ? 20 : 18}
          />
          {/* Debugging info - only visible in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-black bg-opacity-75 text-white text-xs p-1 mt-1 rounded">
              ID: {id}
            </div>
          )}
        </div>

        {type && (
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium font-semibold text-[#1b4d70]">
          {type}
        </div>
        )}
        
        {rating != null && rating >= 4.8 && (
          <div className="absolute bottom-3 right-3 bg-yellow-200 px-2 py-1 rounded-md text-xs font-semibold text-yellow-800 shadow-sm flex items-center">
            <FiStar className="!text-yellow-600 mr-1 drop-shadow-sm" size={12} />
            Featured
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-[#1b4d70] line-clamp-2">{name}</h3>
          {rating != null && rating > 0 && (
            <div className="flex items-center bg-[#f1f6f0] px-2 py-1 rounded-md shadow-sm">
              <FiStar className="!text-yellow-500 mr-1 text-base drop-shadow-sm" />
              <span className="!text-yellow-600 text-sm !font-bold drop-shadow-sm" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
                {rating.toFixed(1)}
              </span>
              {reviewCount > 0 && (
                <span className="text-gray-600 ml-1 text-xs">({reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {!hasRequiredData && (
          <p className="text-red-500 text-xs mt-1">⚠ Missing required data (city/slug)</p>
        )}

        <div className="flex items-center text-gray-700 font-medium text-sm">
          <FiMapPin className="mr-1 text-[#1b4d70]" />
          <span>{city || 'N/A'}, {state || 'N/A'}</span>
        </div>

        {displayAmenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayAmenities.map((amenity, index) => (
              <div 
                key={index} 
                className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-xs text-gray-700 font-medium"
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
    <>
      <article className={`flex flex-col justify-between h-full p-4 shadow rounded-md min-h-[380px] ${className} transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 ${
        !hasRequiredData ? 'cursor-not-allowed bg-white' :
        rating != null && rating >= 4.8 ? 'border border-yellow-300 bg-yellow-50 hover:ring-2 hover:ring-yellow-300' :
        'bg-white border border-gray-200 hover:ring-2 hover:ring-primary'
      }`}>
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

        <div className="mt-auto w-full flex flex-wrap gap-2 pt-4">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full shadow-sm transition inline-flex items-center justify-center"
            onClick={handleScheduleTour}
            disabled={!hasRequiredData}
          >
            <Calendar className="w-4 h-4 inline-block mr-1 -mt-0.5" />
            Book a Free Tour
          </button>
          <button
            className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium py-2 px-4 rounded-full transition inline-flex items-center justify-center"
            onClick={handleRequestPricing}
            disabled={!hasRequiredData}
          >
            <DollarSign className="w-4 h-4 inline-block mr-1 -mt-0.5" />
            See Your Customized Pricing
          </button>
        </div>
      </article>

      <RequestInfoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        communityName={name}
        requestType={modalRequestType}
      />
    </>
  );
};

export default ProviderCard;
