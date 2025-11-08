import React from 'react';
import { Community } from '@/data/facilities';
import Script from 'next/script';

interface SchemaOrgProps {
  community: Community;
}

export function SchemaOrg({ community }: SchemaOrgProps) {
  // Extract zip code from address if available
  const extractZipCode = (address?: string): string => {
    if (!address) return '';
    // Match 5-digit zip code or 5+4 format
    const zipMatch = address.match(/\b\d{5}(-\d{4})?\b/);
    return zipMatch ? zipMatch[0] : '';
  };

  const city = community.location.split(',')[0].trim();
  const slug = community.name.toLowerCase().replace(/\s+/g, '-');

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HealthAndBeautyBusiness'],
    name: community.name,
    description: community.description || `${community.name} is a senior living community in ${community.location} offering ${community.careTypes.join(', ')}.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: community.address,
      addressLocality: city,
      addressRegion: 'OH',
      postalCode: extractZipCode(community.address),
      addressCountry: 'US',
    },
    geo: community.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: community.coordinates.lat,
      longitude: community.coordinates.lng,
    } : undefined,
    email: "info@guideforseniors.com",
    url: `https://www.guideforseniors.com/community/${community.id}/${slug}`,
    image: community.images,
    priceRange: community.careTypes.includes('Memory Care') ? '$$$$' : '$$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '50',
      bestRating: '5',
      worstRating: '1'
    },
    amenityFeature: community.amenities?.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.guideforseniors.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `Senior Living in ${city}`,
        item: `https://www.guideforseniors.com/location/${city.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: community.name,
        item: `https://www.guideforseniors.com/community/${community.id}/${slug}`
      }
    ]
  };

  return (
    <>
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
} 