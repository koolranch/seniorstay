'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Home } from 'lucide-react';

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

// Reliable SVG-based placeholder generator (no external dependencies)
function generatePlaceholderSVG(name: string, index: number): string {
  // Color palette for senior living communities (warm, professional colors)
  const colors = [
    { bg: '#1e3a5f', accent: '#3b82f6' }, // Navy blue
    { bg: '#065f46', accent: '#10b981' }, // Green
    { bg: '#7c2d12', accent: '#f97316' }, // Warm brown
    { bg: '#4c1d95', accent: '#8b5cf6' }, // Purple
    { bg: '#0f766e', accent: '#14b8a6' }, // Teal
    { bg: '#9a3412', accent: '#fb923c' }, // Orange
  ];
  
  const colorSet = colors[index % colors.length];
  const initials = name
    .split(/[\s,]+/)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() || '')
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorSet.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colorSet.accent};stop-opacity:0.8" />
        </linearGradient>
        <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.5" fill="white" fill-opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#grad)"/>
      <rect width="800" height="600" fill="url(#pattern)"/>
      <g transform="translate(400, 240)">
        <circle r="80" fill="white" fill-opacity="0.15"/>
        <path d="M-40 20 L0 -30 L40 20 L40 50 L-40 50 Z" fill="white" fill-opacity="0.9"/>
        <rect x="-15" y="25" width="30" height="25" fill="${colorSet.bg}" fill-opacity="0.6"/>
        <rect x="-30" y="35" width="15" height="15" fill="${colorSet.accent}" fill-opacity="0.4"/>
        <rect x="15" y="35" width="15" height="15" fill="${colorSet.accent}" fill-opacity="0.4"/>
      </g>
      <text x="400" y="380" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-size="32" font-weight="600" opacity="0.9">${initials}</text>
      <text x="400" y="520" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-size="16" opacity="0.7">Senior Living Community</text>
      <text x="400" y="550" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-size="14" opacity="0.5">Guide for Seniors</text>
    </svg>
  `;
  
  return `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;
}

/**
 * Get a consistent placeholder based on community name
 */
function getPlaceholderDataUrl(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return generatePlaceholderSVG(name, hash);
}

/**
 * Check if a URL is valid for use as an image source
 */
function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  
  // Check for valid URL patterns
  return (
    trimmed.startsWith('http://') || 
    trimmed.startsWith('https://') || 
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:')
  );
}

/**
 * CommunityImage component with built-in fallback for broken images
 * Uses SVG data URLs for instant, reliable placeholders (no external requests)
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
  // Generate placeholder once, memoized based on alt text
  const placeholder = useMemo(() => getPlaceholderDataUrl(alt || 'Community'), [alt]);
  
  // Determine initial image source - use placeholder if src is invalid
  const initialSrc = isValidImageUrl(src) ? src : placeholder;
  
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(!isValidImageUrl(src));
  const [isLoading, setIsLoading] = useState(isValidImageUrl(src));

  // Reset state when src changes
  useEffect(() => {
    const validSrc = isValidImageUrl(src);
    setImgSrc(validSrc ? src : placeholder);
    setHasError(!validSrc);
    setIsLoading(validSrc);
  }, [src, placeholder]);

  const handleError = () => {
    if (!hasError) {
      // Use inline SVG placeholder (no external request needed)
      setHasError(true);
      setIsLoading(false);
      setImgSrc(placeholder);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // For data URLs (our SVG placeholders), use unoptimized
  const isDataUrl = imgSrc.startsWith('data:');
  
  return (
    <div 
      className={`relative ${fill ? 'w-full h-full' : ''}`}
      style={!fill ? { width, height } : undefined}
    >
      {/* Loading skeleton */}
      {isLoading && !isDataUrl && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse flex items-center justify-center ${className}`}
        >
          <Home className="w-12 h-12 text-slate-300" />
        </div>
      )}
      
      <Image
        src={imgSrc}
        alt={alt || 'Senior living community'}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`${className} ${isLoading && !isDataUrl ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        sizes={sizes || '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={isDataUrl}
        loading={priority ? undefined : 'lazy'}
      />
    </div>
  );
}


