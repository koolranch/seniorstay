import React from 'react';
import { Community } from '@/data/facilities';
import Script from 'next/script';

interface SchemaOrgProps {
  community: Community;
}

export default function SchemaOrg({ community }: SchemaOrgProps) {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: community.name,
    description: community.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: community.address,
      addressLocality: community.location.split(',')[0].trim(),
      addressRegion: community.location.split(',')[1]?.trim() || 'OH',
      postalCode: community.zipCode,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: community.coordinates.lat,
      longitude: community.coordinates.lng,
    },
    telephone: community.phone,
    url: `https://clevelandsr.com/community/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`,
    image: community.images[0],
    priceRange: community.priceRange,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: community.rating,
      reviewCount: community.reviewCount,
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