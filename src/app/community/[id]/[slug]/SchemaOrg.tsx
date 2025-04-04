import React from 'react';
import { Community } from '@/data/facilities';
import Script from 'next/script';

interface SchemaOrgProps {
  community: Community;
}

export default function SchemaOrg({ community }: SchemaOrgProps) {
  // Extract zip code from address if available
  const extractZipCode = (address?: string): string => {
    if (!address) return '';
    // Match 5-digit zip code or 5+4 format
    const zipMatch = address.match(/\b\d{5}(-\d{4})?\b/);
    return zipMatch ? zipMatch[0] : '';
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: community.name,
    description: community.description || `${community.name} is a senior living community located in ${community.location}.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: community.address,
      addressLocality: community.location.split(',')[0].trim(),
      addressRegion: community.location.split(',')[1]?.trim() || 'OH',
      postalCode: extractZipCode(community.address),
      addressCountry: 'US',
    },
    geo: community.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: community.coordinates.lat,
      longitude: community.coordinates.lng,
    } : undefined,
    // Use default values for missing properties
    telephone: '(800) 555-1234', // Default phone number
    url: `https://clevelandsr.com/community/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`,
    image: community.images[0],
    priceRange: '$$$', // Default price range
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5', // Default rating
      reviewCount: '10', // Default review count
    },
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
} 