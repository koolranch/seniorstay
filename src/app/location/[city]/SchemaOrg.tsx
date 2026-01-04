"use client";

import React from 'react';
import { Community } from '@/data/facilities';
import Script from 'next/script';

interface SchemaOrgProps {
  cityName: string;
  stateAbbr: string;
  communities: Community[];
}

// This component adds structured data for LocalBusiness to improve SEO
const SchemaOrg: React.FC<SchemaOrgProps> = ({ cityName, stateAbbr, communities }) => {
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  
  // LocalBusiness Organization schema for the city page
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://guideforseniors.com/location/${citySlug}#localbusiness`,
    "name": `Guide for Seniors - Senior Living in ${cityName}, ${stateAbbr}`,
    "description": `Find senior living communities in ${cityName}, ${stateAbbr} with Guide for Seniors. Compare assisted living, memory care, and independent living options.`,
    "url": `https://guideforseniors.com/location/${citySlug}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": stateAbbr,
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "containedInPlace": {
        "@type": "State",
        "name": "Ohio"
      }
    },
    "telephone": "(216) 677-4630",
    "priceRange": "$$-$$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    },
    "sameAs": [
      "https://www.facebook.com/guideforseniors",
      "https://twitter.com/guideforseniors",
      "https://www.linkedin.com/company/guide-for-seniors"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // BreadcrumbList schema for better SERP appearance
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://guideforseniors.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Greater Cleveland",
        "item": "https://guideforseniors.com/greater-cleveland"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${cityName}, ${stateAbbr}`,
        "item": `https://guideforseniors.com/location/${citySlug}`
      }
    ]
  };

  // Generate community list schema with detailed address info
  const communityListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Senior Living Communities in ${cityName}, ${stateAbbr}`,
    "description": `Complete list of ${communities.length} assisted living and memory care communities in ${cityName}, Ohio`,
    "numberOfItems": communities.length,
    "itemListElement": communities.map((community, index) => {
      // Extract zip code from address if available
      const zipCode = community.address?.match(/\b\d{5}\b/)?.[0] || '';
      
      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": community.name,
          "description": community.description || `Senior living community in ${cityName}, ${stateAbbr}`,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": community.address || '',
            "addressLocality": cityName,
            "addressRegion": stateAbbr,
            "postalCode": zipCode,
            "addressCountry": "US",
          },
          "geo": community.coordinates ? {
            "@type": "GeoCoordinates",
            "latitude": community.coordinates.lat,
            "longitude": community.coordinates.lng,
          } : undefined,
          "telephone": "(216) 677-4630",
          "url": `https://guideforseniors.com/community/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`,
          "image": community.images[0],
        }
      };
    }),
  };

  // Combine all schemas into one array
  const allSchemas = [localBusinessSchema, breadcrumbSchema, communityListSchema];

  return (
    <Script
      id="location-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(allSchemas) }}
    />
  );
};

export default SchemaOrg;
