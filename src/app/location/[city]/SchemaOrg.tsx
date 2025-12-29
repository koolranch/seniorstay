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
  // LocalBusiness Organization schema for the city page
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
          "name": `Guide for Seniors - Senior Living in ${cityName}, ${stateAbbr}`,
      "description": `Find senior living communities in ${cityName}, ${stateAbbr} with Guide for Seniors. Compare assisted living, memory care, and independent living options.`,
    "url": `https://guideforseniors.com/location/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": stateAbbr
    },
    "telephone": "(216) 677-4630",
    "sameAs": [
      "https://www.facebook.com/guideforseniors",
      "https://twitter.com/guideforseniors",
      "https://www.linkedin.com/company/guide-for-seniors"
    ]
  };

  // Generate community list schema with detailed address info
  const communityListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
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

  // Add LocalBusiness schema with aggregate rating
  const localBusinessWithRatingSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Senior Living Options in ${cityName}, ${stateAbbr}`,
    "description": `Find the best senior living communities in ${cityName}, ${stateAbbr}. We help seniors and families find assisted living, memory care, and independent living communities.`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "124",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <Script
      id="community-list-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(communityListSchema) }}
    />
  );
};

export default SchemaOrg;
