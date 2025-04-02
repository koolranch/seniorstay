"use client";

import React from 'react';
import { Community } from '@/data/facilities';

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
    "description": `Find senior living facilities in ${cityName}, ${stateAbbr} with Cleveland Senior Guide. Compare assisted living, memory care, and independent living options.`,
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

  // Generate facility list schema with detailed address info
  const facilityListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": communities.map((community, index) => {
      // Extract street address from the full address if available
      const streetAddress = community.address ? community.address.split(',')[0].trim() : "";
      const addressLocality = community.location.split(',')[0].trim();
      const addressRegion = community.location.split(',')[1] ? community.location.split(',')[1].trim() : stateAbbr;

      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": community.name,
          "description": community.description || `${community.name} is a senior living facility in ${community.location}`,
          "url": `https://rayseniorplacement.com/community/${community.id}/${community.name.toLowerCase().replace(/\s+/g, '-')}`,
          "telephone": "(800) 555-1234",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": streetAddress,
            "addressLocality": addressLocality,
            "addressRegion": addressRegion,
            "postalCode": community.address ? community.address.match(/\d{5}(?:-\d{4})?/)?.[0] || "" : ""
          },
          "geo": community.coordinates ? {
            "@type": "GeoCoordinates",
            "latitude": community.coordinates.lat,
            "longitude": community.coordinates.lng
          } : undefined
        }
      };
    })
  };

  // Add LocalBusiness schema with aggregate rating
  const localBusinessWithRatingSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Senior Living Options in ${cityName}, ${stateAbbr}`,
    "description": `Find the best senior living communities in ${cityName}, ${stateAbbr}. We help seniors and families find assisted living, memory care, and independent living facilities.`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "124",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([localBusinessSchema, facilityListSchema, localBusinessWithRatingSchema])
      }}
    />
  );
};

export default SchemaOrg;
