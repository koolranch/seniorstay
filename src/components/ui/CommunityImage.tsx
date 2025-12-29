'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Building2 } from 'lucide-react';

interface CommunityImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

// Cleveland landmark fallback images (high quality, local relevance)
const CLEVELAND_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Cleveland skyline
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80', // Modern healthcare building
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Professional building
  'https://images.unsplash.com/photo-1564731071754-8f8cd0ba8f30?w=800&q=80', // Medical facility
];

/**
 * Get a consistent fallback image based on the alt text (community name)
 */
function getFallbackImage(alt: string): string {
  const hash = alt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CLEVELAND_FALLBACK_IMAGES[hash % CLEVELAND_FALLBACK_IMAGES.length];
}

/**
 * CommunityImage component with built-in fallback for broken images
 * Shows branded placeholder when images fail to load
 */
export default function CommunityImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  sizes,
  priority = false,
}: CommunityImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const handleError = () => {
    if (!hasError) {
      // First error: try Cleveland landmark fallback
      setHasError(true);
      setImgSrc(getFallbackImage(alt));
    } else {
      // Second error: show branded placeholder
      setShowPlaceholder(true);
    }
  };

  // Show branded placeholder if all images failed
  if (showPlaceholder) {
    return (
      <div 
        className={`bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm font-medium text-gray-700">Image Coming Soon</p>
          <p className="text-xs text-gray-500 mt-1">Guide for Seniors</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={handleError}
      unoptimized
    />
  );
}

