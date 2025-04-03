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
    "name": `Cleveland Senior Guide - Senior Living in ${cityName}, ${stateAbbr}`,
    "description": `Find senior living communities in ${cityName}, ${stateAbbr} with Cleveland Senior Guide. Compare assisted living, memory care, and independent living options.`,
    "url": `https://rayseniorplacement.com/location/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": stateAbbr
    },
    "telephone": "(800) 555-1234",
    "sameAs": [
      "https://www.facebook.com/rayseniorplacement",
      "https://twitter.com/rayseniorplacement",
      "https://www.linkedin.com/company/ray-senior-placement"
    ]
  };

  // Generate community list schema with detailed address info
  const communityListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": communities.map((community, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": community.name,
        "description": community.description,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": community.address,
          "addressLocality": cityName,
          "addressRegion": stateAbbr,
          "postalCode": community.zipCode,
          "addressCountry": "US",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": community.coordinates.lat,
          "longitude": community.coordinates.lng,
        },
        "telephone": community.phone,
        "url": `https://clevelandsr.com/community/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`,
        "image": community.images[0],
        "priceRange": community.priceRange,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": community.rating,
          "reviewCount": community.reviewCount,
        },
      }
    })),
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
